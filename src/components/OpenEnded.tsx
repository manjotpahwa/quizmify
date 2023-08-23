"use client";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { Timer, Loader2, ChevronRight, BarChart } from "lucide-react";
import { now } from "next-auth/client/_utils";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import BlankAnswerInput from "./BlankAnswerInput";
import Link from "next/link";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState<string>("");
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const [now, setNow] = React.useState<Date>(new Date());
  const { toast } = useToast();
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);
  console.log(currentQuestion.answer);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        filledAnswer = filledAnswer.replace("_____", input.value);
        input.value = "";
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  const handleNext = React.useCallback(() => {
    if (isChecking) return;
    console.log(blankAnswer);

    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `your answer is ${percentageSimilar}% simiilar to the correct answer`,
          description: "answers are matched on similarity",
        });
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [
    checkAnswer,
    toast,
    isChecking,
    questionIndex,
    game.questions.length,
    blankAnswer,
  ]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col"></div>
        <p>
          <span className="mr-2 text-slate-400">Topic</span>
          <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
            {game.topic}
          </span>
        </p>
        <div className="flex self-start mt-3 text-slate-400">
          <Timer className="mr-2"></Timer>
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          <span>00:00</span>
        </div>
        {/* <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        /> */}
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center q-full mt-4">
        <BlankAnswerInput
          answer={currentQuestion.answer}
          setBlankAnswer={setBlankAnswer}
        />
        <Button
          className="mt-2"
          disabled={isChecking}
          onClick={() => {
            handleNext();
          }}
        >
          {isChecking && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin"></Loader2>
          )}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
