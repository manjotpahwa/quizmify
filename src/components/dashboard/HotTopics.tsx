import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { History } from "lucide-react";
import CustomWordCloud from "../CustomWordCloud";
import { prisma } from "@/lib/db";

type Props = {};

const HotTopics = async (props: Props) => {
  const topics = await prisma.topicCount.findMany({});
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });

  return (
    <Card className="hover:cursor-pointer hover:opacity-75 col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>Click on a topic to start the quiz!</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWordCloud formattedTopics={formattedTopics}></CustomWordCloud>
      </CardContent>
    </Card>
  );
};

export default HotTopics;
