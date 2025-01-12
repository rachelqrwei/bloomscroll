import React, { useState, useEffect } from "react";

export default function Clock() {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
            setCurrentTime(timeString);
        };

        // Update time initially and set interval
        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="mb-[4%] flex justify-center items-center h-full">
            <p className="font-mono text-3xl font-bold tracking-tight text-[#c2cdda] opacity-85">
                {currentTime}
            </p>
        </div>
    );
}
