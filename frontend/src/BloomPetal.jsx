import React from "react";
import { Heart, Play, Pause, Share, FastForward } from "lucide-react";

const BloomPetal = React.forwardRef(
    (
        { src, handleVideoHold, handlePlayPause, isFastForwards, isPlaying },
        ref
    ) => {
        return (
            <div className="relative w-full max-w-2xl h-[690px] object-cover rounded-lg shadow-lg snap-start">
                <video
                    ref={ref}
                    src={src}
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
                    <div className="items-center justify-center text-center pb-5">
                        <Heart className="w-10 h-10 text-white p-1" />
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
        );
    }
);

export default BloomPetal;
