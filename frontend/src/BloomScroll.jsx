import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChevronsDown } from "lucide-react";
import BloomPetal from "./BloomPetal";

function BloomScroll() {
    const { prompt } = useParams();
    const [videoNames, setVideoNames] = useState([
        "how_to_sleep_1736658573062.mp4",
        "default_1736662432850.mp4",
        "how_to_make_money_1736658244069.mp4",
        ,
    ]);

    const videoRefs = useRef([]);
    const placeHolderRef = useRef(null);
    const [isFastForwards, setIsFastForwards] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const holdTimerRef = useRef(null);
    const holdStartTimeRef = useRef(null);

    // Track the currently visible video
    const [visibleVideoIndex, setVisibleVideoIndex] = useState(-1);

    useEffect(() => {
        console.log("Prompt:", prompt);
        if (prompt == "default") return;

        // Fetch video URLs based on the prompt
        const fetchVideoUrls = async () => {
            try {
                const response1 = await fetch(
                    "http://172.18.78.237:6969/generate-video",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt: prompt,
                            useAppPexel: false,
                        }),
                    }
                );
                const data1 = await response1.json();
                console.log("Success:", data1);
                setVideoNames((prev) => [...prev, data1.videoUrls[0]]);

                const response2 = await fetch(
                    "http://172.18.78.237:6969/generate-video",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt: prompt,
                            useAppPexel: true,
                        }),
                    }
                );
                const data2 = await response2.json();
                console.log("Success:", data2);
                setVideoNames((prev) => [...prev, data2.videoUrls[0]]);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchVideoUrls();
    }, [prompt]);

    useEffect(() => {
        // Wait for all DOM elements (videos) to be fully loaded
        const handleLoad = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.target === placeHolderRef.current) {
                            console.log("Active Index:", -1);
                            setVisibleVideoIndex(-1);
                            return;
                        }

                        const index = videoRefs.current.indexOf(entry.target);
                        if (entry.isIntersecting && index !== -1) {
                            // Only set visible video if it's not the last one and it's 50% visible
                            if (index !== videoNames.length - 1) {
                                console.log("Active Index:", index);
                                setVisibleVideoIndex(index);
                            }
                        }
                    });
                },
                { threshold: 0.75 } // Adjust threshold to 75% visibility
            );

            // Observe each video element
            videoRefs.current.forEach((video) => {
                if (video) observer.observe(video);
            });

            observer.observe(placeHolderRef.current);

            return () => {
                observer.disconnect();
            };
        };

        // Ensure the DOM is fully loaded before starting the observer
        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.onload = handleLoad;
        }
    }, [videoNames]); // Dependency on videoNames to ensure the observer is set up correctly after names are updated

    useEffect(() => {
        // Pause all videos except the visible one
        videoRefs.current.forEach((video, index) => {
            if (index !== visibleVideoIndex && video) {
                video.pause();
            }
        });

        // Play the visible video
        const visibleVideo = videoRefs.current[visibleVideoIndex];
        if (visibleVideo && visibleVideo.paused) {
            visibleVideo.currentTime = 0;
            visibleVideo.play();
            setIsPlaying(true);
        }
    }, [visibleVideoIndex]);

    const handlePlayPause = () => {
        const videoElement = videoRefs.current[visibleVideoIndex];
        if (videoElement) {
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
        const videoElement = videoRefs.current[visibleVideoIndex];
        if (videoElement) {
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
        }
    };

    return (
        <div className="z-20 flex flex-col items-center justify-center mt-12">
            {!videoNames.length && (
                <>
                    <h2 className="text-[#faeed7] text-2xl font-bold mb-4">
                        Feed Content
                    </h2>
                    <p className="text-[#faeed7]">
                        Your feed content for prompt: {prompt}
                    </p>
                </>
            )}
            {videoNames.length > 0 && (
                <div className="relative overflow-x-hidden">
                    <div className="flex flex-col snap-y snap-mandatory h-[690px] overflow-y-auto">
                        <div
                            ref={placeHolderRef}
                            className="w-full max-w-2xl h-[690px] object-cover rounded-lg shadow-lg snap-start bg-black"
                        >
                            <h1 className="flex flex-col gap-10 text-[#faeed7] h-[690px] text-2xl font-bold items-center justify-center text-center">
                                Start scrolling to unlock your learning journey
                                <ChevronsDown className="w-10 h-10 text-white p-1" />
                            </h1>
                        </div>
                        {videoNames.map((videoName, index) => (
                            <BloomPetal
                                key={index}
                                ref={(el) => (videoRefs.current[index] = el)}
                                videoName={videoName}
                                handleVideoHold={handleVideoHold}
                                handlePlayPause={handlePlayPause}
                                isFastForwards={isFastForwards}
                                isPlaying={isPlaying}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BloomScroll;
