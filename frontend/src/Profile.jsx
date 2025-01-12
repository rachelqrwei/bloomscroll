import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BloomPetal from "./BloomPetal"; // Import the BloomPetal component

function Profile() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [likedVideos, setLikedVideos] = useState([]); // State for liked videos

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const usernameFromCookie = Cookies.get("username");

        if (token && usernameFromCookie) {
            setIsLoggedIn(true); // User is logged in
            setUsername(usernameFromCookie); // Set username from cookie

            // Fetch liked videos
            fetchLikedVideos(token);
        }
    }, [isLoggedIn]);

    // Fetch liked videos from the backend
    const fetchLikedVideos = async (userToken) => {
        try {
            const response = await fetch(
                "https://03a2-130-113-151-229.ngrok-free.app/user/getAllLikes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userToken }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setLikedVideos(data.likedVideos); // Set the liked videos state
            } else {
                console.log("Error fetching liked videos:", data.error);
            }
        } catch (error) {
            console.error("Error fetching liked videos:", error);
        }
    };

    const handleLogin = async () => {
        if (username && password) {
            try {
                const response = await fetch(
                    "https://03a2-130-113-151-229.ngrok-free.app/user/signin",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    // On successful login, store token and username in cookies
                    Cookies.set("username", username, { expires: 7 });
                    Cookies.set("token", data.userToken, { expires: 7 });
                    setIsLoggedIn(true);
                } else {
                    alert(data.message || "Login failed");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };

    const handleSignup = async () => {
        if (username && password) {
            try {
                const response = await fetch(
                    "https://03a2-130-113-151-229.ngrok-free.app/user/signup",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    // On successful signup, store token and username in cookies
                    Cookies.set("username", username, { expires: 7 });
                    Cookies.set("token", data.userToken, { expires: 7 });
                    setIsLoggedIn(true);
                } else {
                    alert(data.message || "Signup failed");
                }
            } catch (error) {
                console.error("Error during signup:", error);
                alert("An error occurred. Please try again.");
            }
        }
    };

    const handleLogout = () => {
        Cookies.remove("username");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center text-white p-5 h-[100vh]">
                <h2 className="text-2xl font-bold text-center">
                    Welcome to BloomScroll
                </h2>
                <p className="text-lg text-center mb-4">
                    Please sign in/up to access your profile.
                </p>

                <div className="space-y-4 w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 text-center items-center justify-center border border-gray-300 rounded-lg text-[#384649] bg-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 text-center items-center justify-center border border-gray-300 rounded-lg text-[#384649] bg-white"
                    />

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleLogin}
                            className="bg-[#faeed7] text-[#384649] font-bold py-3 px-4 rounded-lg w-[48%]"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleSignup}
                            className="bg-[#205e63] text-[#faeed7] font-bold py-3 px-4 rounded-lg w-[48%]"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-[60px] h-[80.5vh] text-white overflow-scroll">
            <h2 className="text-2xl font-bold ml-[10px] mt-5">
                Welcome back, <u>{username}</u>
            </h2>
            <p className="text-lg ml-[10px]">You are successfully logged in!</p>
            <div className="space-x-4 ml-[10px]">
                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Log Out
                </button>
            </div>
            {/* Display liked videos in a 3-column grid */}
            <div className="grid grid-cols-3 mt-8 w-full max-w-4xl">
                {likedVideos.length > 0 ? (
                    <>
                        {likedVideos.map((videoName, index) => (
                            <BloomPetal
                                key={index}
                                index={index}
                                videoName={videoName}
                                miniDisplay={true}
                            />
                        ))}
                        <p className="my-5 text-center col-span-3">
                            You've reached the end.
                        </p>
                    </>
                ) : (
                    <p className="text-center col-span-3">
                        No liked videos yet.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Profile;
