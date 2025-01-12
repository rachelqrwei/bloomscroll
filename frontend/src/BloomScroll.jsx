import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Heart, Play, Pause, Share, FastForward } from "lucide-react";

function BloomScroll() {
    const { prompt } = useParams();
    const [videoUrls, setVideoUrls] = useState([
        "http://172.18.78.197:3001/videos/how_to_sleep_1736658573062.mp4",
        "http://172.18.78.197:3001/videos/default_1736662432850.mp4",
        "http://172.18.78.197:3001/videos/how_to_make_money_1736658244069.mp4",
        "http://172.18.78.197:3001/videos/how_to_sleep_1736658299873.mp4",
    ]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRef = useRef(null);
    const [isFastForwards, setIsFastForwards] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const holdTimerRef = useRef(null);
    const holdStartTimeRef = useRef(null);

    useEffect(() => {
        console.log("Prompt:", prompt);

        fetch("http://172.18.78.197:3001/generate-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt, useAppPexel: false }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                console.log("Video URL:", data.videoUrls[0]);
                setVideoUrls([...videoUrls, data.videoUrls[0]]);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        fetch("http://172.18.78.197:3001/generate-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt, useAppPexel: true }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                console.log("Video URL:", data.videoUrls[0]);
                setVideoUrls([...videoUrls, data.videoUrls[0]]);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [prompt]);

    const handlePlayPause = () => {
        if (!isFastForwards) {
            const videoElement = videoRef.current;
            if (videoElement.paused) {
                videoElement.play();
                setIsPlaying(true);
            } else {
                videoElement.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleVideoHold = (e) => {
        const videoElement = videoRef.current;
        if (e.type === "mousedown" || e.type === "touchstart") {
            holdStartTimeRef.current = Date.now();
            holdTimerRef.current = setTimeout(() => {
                videoElement.playbackRate = 2.0;
                setIsFastForwards(true);
            }, 500);
        } else if (e.type === "mouseup" || e.type === "touchend") {
            const holdDuration = Date.now() - holdStartTimeRef.current;
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current);
            }
            videoElement.playbackRate = 1.0;
            setIsFastForwards(false);

            if (holdDuration < 500) {
                handlePlayPause();
            }
        }
    };

    return (
        <div className="z-20 flex flex-col items-center justify-center mt-12 ">
            {!videoUrls && (
                <>
                    <h2 className="text-[#faeed7] text-2xl font-bold mb-4">
                        Feed Content
                    </h2>
                    <p className="text-[#faeed7]">
                        Your feed content for prompt: {prompt}
                    </p>
                </>
            )}
            {videoUrls && (
                <div className="relative overflow-hidden">
                    <video
                        ref={videoRef}
                        src={videoUrls[currentVideoIndex]}
                        autoPlay
                        muted
                        loop
                        className="w-full max-w-2xl rounded-lg shadow-lg"
                        onMouseDown={handleVideoHold}
                        onMouseUp={handleVideoHold}
                        onTouchStart={handleVideoHold}
                        onTouchEnd={handleVideoHold}
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

                    <div className="fixed z-100 top-[45%] right-[5%]">
                        <div className="items-center justify-center text-center pb-5 ">
                            <Heart className="w-10 h-10 text-white p-1 " />
                            <div className="text-white text-xs font-bold">
                                {" "}
                                Like
                            </div>
                        </div>
                        <div className="items-center justify-center text-center">
                            <Share className="w-10 h-10 text-white p-1" />
                            <div className="text-white text-xs font-bold">
                                {" "}
                                Share
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BloomScroll;
