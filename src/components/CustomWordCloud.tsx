"use client";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const CustomWordCloud = ({ formattedTopics }: Props) => {
  const theme = useTheme();
  return (
    <D3WordCloud
      height={550}
      font={"Comic Sans"}
      fontSize={(word) => Math.log2(word.value) * 5 + 16}
      rotate={0}
      padding={10}
      spiral={"rectangular"}
      fill={theme.theme == "dark" ? "white" : "black"}
      data={formattedTopics}
    ></D3WordCloud>
  );
};

export default CustomWordCloud;
