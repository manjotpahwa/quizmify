import { NextResponse } from "next/server"
import { quizCreationSchema } from "@/schemas/form/quiz"
import { ZodError } from "zod"
import { strict_output } from "@/lib/gpt"
import { getAuthSession } from "@/lib/nextauth"

export const GET = async(req: Request, res: Response) => {
    return NextResponse.json({
        hello: 'world'
    })

}

// POST /api/questions
export const POST = async (req: Request, resp: Response) => {
    try {
        const session = await getAuthSession();
        // if (!session?.user) {
        //     return NextResponse.json(
        //         {
        //             error: 'You amust be logged in to create a quiz'
        //         },
        //         {
        //             status: 401,
        //         },
        //     );
        // }
        const body = await req.json();
        const {amount, topic, type} = quizCreationSchema.parse(body);
        let questions: any;

        if (type === 'open_ended') {
            questions = await strict_output(
                'You are a heplful AI that would help generate questions and answers, the length of answers should not exceed 15 words. Store all pairs of questions and answers in a json array. ',
                new Array(amount).fill(
                    `You are to generate a random hard open ended question about ${topic}`),
                {
                    question: "question",
                    answer: "answer with max length 15 words"
                }
            )
        } else if (type === 'mcq') {
            questions = await strict_output(
            'You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not exceed 15 words. Store all questions and answers and options in a JSON array.',
            new Array(amount).fill(
                `You are to generate a random mcq question about ${topic}`
            ),
            {
                question: 'question',
                answer: 'answer with max length of 15 words',
                option1: '1st option with max length of 15 words',
                option2: '2nd option with max length of 15 words',
                option3: '3rd option with max length of 15 words',
            }  
            )
        }
        console.log("printing the questions generated");
        console.log({questions});

        return NextResponse.json(
            {
                questions,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: error.issues,
                },
                {
                    status: 400
                },
            );  
        }
    }
};