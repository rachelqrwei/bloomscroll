import React from 'react';

const ProgressBar = ({progress}) => {
  const radius = 100; // Radius of the progress circle
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  // Determine which image to use based on progress
  const flowerImage = progress > 58 ? "../../public/flower-pink.png" : "../../public/flower-grey.png";

  return (
    <div className=" m-[5svh] relative flex justify-center items-center ">
      <svg width={radius * 2} height={radius * 2}>
        {/* Background Circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#d4deea"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.8"
        />
        {/* Gradient Stroke */}
        <defs>
          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe3ac" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffb5aa" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Foreground Circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="url(#gradientStroke)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {/* Center Image */}
      <img
        src= {flowerImage} // Ensure this path points to your image
        alt="Flower"
        className="absolute w-[120px] h-[120px]"
        style={{
          top: `${radius * 0.4}px`,
          left: `${radius * 0.4}px`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
