import { OpenAI } from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
      output_format
      )}. \nStrictly do not put quotation marks, commas or double quotation marks or escape character \\ in the output fields.`;
      
    // output field will be a list, even if of 1 element
    output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
      

    // if output_format contains dynamic elements, process it accordingly
    if (dynamic_elements) {
        output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    // input is always list, even of just 1 element
    output_format_prompt += `\nGenerate a list of json, one json for each input element. Separate out the JSON elements in the list with a semicolon delimiter.`;
      

    // Use OpenAI to get a response
    const response = await openai.chat.completions.create({
      temperature: temperature,
      model: model,
      messages: [
        {
          role: "system",
          content: system_prompt + output_format_prompt + error_msg,
        },
        { role: "user", content: user_prompt.toString() },
      ],
    });

    console.log("printing response we received from OpenAI")
    console.log(response.choices[0].message.content)

    let res: string =
      response.choices[0].message?.content?.replace(/'/g, '"') ?? "";

    // ensure that we don't replace away apostrophes in text
    res = res.replace(/(\w)"(\w)/g, "$1'$2");
    // console.log("printing the second edit to our string")
    // console.log(res)

    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }

    console.log("parsing")
    const list_of_valid_json = res.split(';');
    let final_result = []

    for (let idx = 0; idx < list_of_valid_json.length; idx++) {
      // try-catch block to ensure output format is adhered to
      try {
        let output: any = JSON.parse((list_of_valid_json[idx]));

        for (const key in output_format) {
          // unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) {
            continue;
          }

          // if output field missing, raise an error
          if (!(key in output)) {
            throw new Error(`${key} not in json output`);
          }

          // check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            // ensure output is not a list
            if (Array.isArray(output[key])) {
              output[key] = output[key][0];
            }
            // output the default category (if any) if GPT is unable to identify the category
            if (!choices.includes(output[key]) && default_category) {
              output[key] = default_category;
            }
            // if the output is a description format, get only the label
            if (output[key].includes(":")) {
              output[key] = output[key].split(":")[0];
            }
          }
          final_result[idx] = output
        }
      } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format:", res);
      }
    }
    return final_result;
  }
  return [];
}