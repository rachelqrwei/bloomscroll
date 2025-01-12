import React, { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Play, Pause, Share, FastForward, X } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const BloomPetal = React.forwardRef(
    (
        {
            videoName,
            handleVideoHold: externalVideoHold,
            handlePlayPause: externalPlayPause,
            isFastForwards: externalIsFastForwards,
            isPlaying: externalIsPlaying,
            miniDisplay,
        },
        ref
    ) => {
        const [isLiked, setIsLiked] = useState(false);
        const [isExpanded, setIsExpanded] = useState(false);
        const [isFastForwards, setIsFastForwards] = useState(false);
        const [isPlaying, setIsPlaying] = useState(false);

        const holdTimerRef = useRef(null);
        const holdStartTimeRef = useRef(null);

        const navigate = useNavigate();

        // Create a default ref if none is provided
        const internalRef = useRef(null);
        const videoRef = ref || internalRef;

        useEffect(() => {
            const checkIfLiked = async () => {
                const userToken = Cookies.get("token");

                const response = await fetch(
                    "https://03a2-130-113-151-229.ngrok-free.app/user/isLiked",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userToken,
                            videoName,
                        }),
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setIsLiked(data.isLiked);
                } else {
                    console.error("Error checking like status:", data.error);
                }
            };

            checkIfLiked();
        }, [videoName]);

        const handleLike = async () => {
            const userToken = Cookies.get("token");

            const response = await fetch(
                "https://03a2-130-113-151-229.ngrok-free.app/user/like",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userToken,
                        videoName,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setIsLiked(true);
            } else {
                console.error("Error liking the video:", data.error);
                navigate("/profile");
            }
        };

        const handleUnlike = async () => {
            const userToken = Cookies.get("token");

            const response = await fetch(
                "https://03a2-130-113-151-229.ngrok-free.app/user/unlike",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userToken,
                        videoName,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setIsLiked(false);
            } else {
                console.error("Error unliking the video:", data.error);
                navigate("/profile");
            }
        };

        const toggleExpand = () => {
            if (videoRef.current) {
                if (isExpanded) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                } else {
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            }
            setIsExpanded((prev) => !prev);
        };

        const handlePlayPause = useCallback(() => {
            if (videoRef.current) {
                if (videoRef.current.paused) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            }
        }, [videoRef]);

        const handleVideoHold = useCallback(
            (e) => {
                if (!videoRef.current) return;

                if (e.type === "mousedown" || e.type === "touchstart") {
                    holdStartTimeRef.current = Date.now();
                    holdTimerRef.current = setTimeout(() => {
                        videoRef.current.playbackRate = 2.0;
                        setIsFastForwards(true);
                    }, 500);
                } else if (e.type === "mouseup" || e.type === "touchend") {
                    const holdDuration = Date.now() - holdStartTimeRef.current;
                    clearTimeout(holdTimerRef.current);
                    videoRef.current.playbackRate = 1.0;
                    setIsFastForwards(false);

                    if (holdDuration < 500) {
                        externalPlayPause
                            ? externalPlayPause()
                            : handlePlayPause();
                    }
                }
            },
            [videoRef, externalPlayPause, handlePlayPause]
        );

        return (
            <div
                className={`${
                    isExpanded
                        ? "w-[390px] h-[690px] z-50 absolute top-[50px] left-0"
                        : miniDisplay
                        ? "relative w-[130px] h-[230px]"
                        : "relative w-[390px] h-[690px]"
                } object-cover shadow-lg snap-start`}
                onClick={miniDisplay && !isExpanded ? toggleExpand : undefined}
            >
                <video
                    ref={videoRef}
                    src={`https://03a2-130-113-151-229.ngrok-free.app/videos/${videoName}`}
                    loop
                    onMouseDown={externalVideoHold || handleVideoHold}
                    onMouseUp={externalVideoHold || handleVideoHold}
                    onTouchStart={externalVideoHold || handleVideoHold}
                    onTouchEnd={externalVideoHold || handleVideoHold}
                    className={`w-full h-full object-cover ${
                        isExpanded
                            ? "w-[390px] h-[690px]"
                            : miniDisplay
                            ? "rounded-md"
                            : "rounded-lg"
                    }`}
                />

                {miniDisplay && isExpanded && (
                    <button
                        onClick={toggleExpand}
                        className="absolute top-4 right-4 bg-black/50 p-3 rounded-full text-xl w-10 h-10 flex items-center justify-center"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                )}

                {((miniDisplay && isExpanded) || !miniDisplay) && (
                    <>
                        <button
                            onClick={externalPlayPause || handlePlayPause}
                            className="absolute bottom-16 left-4 bg-black/50 p-3 rounded-full text-xl w-12 h-12 flex items-center justify-center"
                        >
                            {externalIsFastForwards || isFastForwards ? (
                                <FastForward className="w-6 h-6 text-white" />
                            ) : externalIsPlaying || isPlaying ? (
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
                    </>
                )}
            </div>
        );
    }
);

export default BloomPetal;
