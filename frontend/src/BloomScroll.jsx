import React from "react";
import { useParams } from "react-router-dom";

function BloomScroll() {
  const { prompt } = useParams();

  return (
    <div className="z-20 flex flex-col items-center justify-center mt-16 mb-20">
      <h2 className="text-[#faeed7] text-2xl font-bold mb-4">Feed Content</h2>
      <p className="text-[#faeed7]">Your feed content for prompt: {prompt}</p>
    </div>
  );
}

export default BloomScroll;

