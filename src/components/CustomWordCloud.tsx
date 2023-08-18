import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {};
const words = [
  { text: "Hey", value: 1000 },
  { text: "lol", value: 200 },
  { text: "first impression", value: 800 },
  { text: "very cool", value: 1000000 },
  { text: "duck", value: 10 },
];

const CustomWordCloud = (props: Props) => {
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
      data={words}
    ></D3WordCloud>
  );
};

export default CustomWordCloud;
