import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Heart, Play, Pause, Share } from 'lucide-react';

function BloomScroll() {
    const { prompt } = useParams();
    const [videoUrl, setVideoUrl] = useState(
        "http://172.18.78.197:3001/videos/how_to_sleep_1736658573062.mp4"
    );
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        console.log("Prompt:", prompt);

        fetch("http://172.18.78.197:3001/generate-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                console.log("Video URL:", data.videoUrls[0]);
                setVideoUrl(data.videoUrls[0]);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [prompt]);

    const handlePlayPause = () => {
        const videoElement = videoRef.current;
        if (videoElement.paused) {
            videoElement.play();
            setIsPlaying(true);
        } else {
            videoElement.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="z-20 flex flex-col items-center justify-center mt-12 ">
            {!videoUrl && (
                <>
                    <h2 className="text-[#faeed7] text-2xl font-bold mb-4">
                        Feed Content
                    </h2>
                    <p className="text-[#faeed7]">
                        Your feed content for prompt: {prompt}
                    </p>
                </>
            )}
            {videoUrl && (
                <div className="relative overflow-hidden">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        autoPlay
                        muted
                        loop
                        className="w-full max-w-2xl rounded-lg shadow-lg"
                        onClick={handlePlayPause}
                    />
                    <button
                        onClick={handlePlayPause}
                        className="absolute bottom-16 left-4 bg-black/50 p-3 rounded-full text-xl w-12 h-12 flex items-center justify-center"
                    >
                         {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                    </button>
                </div>
            )}
        </div>
    );
}

export default BloomScroll;
