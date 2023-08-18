"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomWordCloud from "../CustomWordCloud";

type Props = {};

const HotTopics = (props: Props) => {
  const router = useRouter();
  return (
    <Card className="hover:cursor-pointer hover:opacity-75 col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>Click on a topic to start the quiz!</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWordCloud></CustomWordCloud>
      </CardContent>
    </Card>
  );
};

export default HotTopics;
