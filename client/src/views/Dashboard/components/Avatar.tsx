import { Box } from "@mui/material";
import React from "react";

const Avatar = () => {
  const colors = [
    "bg-teal-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-gray-200",
  ];

  const userIdBase10 = parseInt("5f8b9d3b9d3f4a0017f6e4a1", 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <Box className={"w-8 h-8 rounded-full flex items-center" + color}>
      <Box className="text-center w-full opacity-70">A</Box>
    </Box>
  );
};

export default Avatar;
