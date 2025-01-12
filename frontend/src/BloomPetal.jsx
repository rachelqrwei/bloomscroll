import React, { useState, useEffect } from "react";
import { Heart, Play, Pause, Share, FastForward } from "lucide-react";
import Cookies from "js-cookie";

const BloomPetal = React.forwardRef(
    (
        {
            videoName,
            handleVideoHold,
            handlePlayPause,
            isFastForwards,
            isPlaying,
        },
        ref
    ) => {
        const [isLiked, setIsLiked] = useState(false);

        useEffect(() => {
            // Check if the video is liked when the component mounts
            const checkIfLiked = async () => {
                const userToken = Cookies.get("token"); // Assuming token is stored in cookies

                const response = await fetch(
                    "http://localhost:3001/user/isLiked",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userToken: userToken,
                            videoName: videoName,
                        }),
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setIsLiked(data.isLiked); // Set the state based on the response
                } else {
                    console.log("Error checking like status:", data.error);
                }
            };

            checkIfLiked();
        }, [videoName]);

        const handleLike = async () => {
            const userToken = Cookies.get("token"); // Assuming token is stored in cookies

            // Send a request to like/unlike the video
            const response = await fetch("http://localhost:3001/user/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userToken: userToken,
                    videoName: videoName,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsLiked(true); // Set the state to true if the video is liked
            } else {
                console.log("Error liking the video:", data.error);
            }
        };

        const handleUnlike = async () => {
            const userToken = Cookies.get("token"); // Assuming token is stored in cookies

            // Send a request to unlike the video
            const response = await fetch("http://localhost:3001/user/unlike", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userToken: userToken,
                    videoName: videoName,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsLiked(false); // Set the state to false if the video is unliked
            } else {
                console.log("Error unliking the video:", data.error);
            }
        };

        return (
            <div className="relative w-full max-w-2xl h-[690px] object-cover rounded-lg shadow-lg snap-start">
                <video
                    ref={ref}
                    src={`http://localhost:3001/videos/${videoName}`}
                    loop
                    onMouseDown={handleVideoHold}
                    onMouseUp={handleVideoHold}
                    onTouchStart={handleVideoHold}
                    onTouchEnd={handleVideoHold}
                    className="w-full h-full object-cover"
                />

                <button
                    onClick={handlePlayPause}
                    className="absolute bottom-16 left-4 bg-black/50 p-3 rounded-full text-xl w-12 h-12 flex items-center justify-center"
                >
                    {isFastForwards ? (
                        <FastForward className="w-6 h-6 text-white" />
                    ) : isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                    ) : (
                        <Play className="w-6 h-6 text-white" />
                    )}
                </button>

                <div className="absolute z-100 top-[45%] right-[5%]">
                    <div
                        className="items-center justify-center text-center pb-5"
                        onClick={isLiked ? handleUnlike : handleLike}
                    >
                        <Heart
                            className={`w-10 h-10 p-1 ${
                                isLiked ? "text-red-500" : "text-white"
                            }`}
                        />
                        <div className="text-white text-xs font-bold">
                            {isLiked ? "Liked" : "Like"}
                        </div>
                    </div>
                    <div className="items-center justify-center text-center">
                        <Share className="w-10 h-10 text-white p-1" />
                        <div className="text-white text-xs font-bold">
                            Share
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default BloomPetal;
