import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Profile() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const usernameFromCookie = Cookies.get("username");

        if (token && usernameFromCookie) {
            setIsLoggedIn(true); // User is logged in
        }
    }, []);

    const handleLogin = async () => {
        if (username && password) {
            try {
                const response = await fetch(
                    "http://localhost:3001/user/signin",
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
                    Cookies.set("token", data.token, { expires: 7 });
                    setIsLoggedIn(true);
                    navigate("/dashboard");
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
                    "http://localhost:3001/user/signup",
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
                    Cookies.set("token", data.token, { expires: 7 });
                    setIsLoggedIn(true);
                    navigate("/dashboard");
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
        <div className="flex flex-col items-center justify-center h-full text-white">
            <h2 className="text-2xl font-bold">Welcome back, {username}</h2>
            <p className="text-lg">You are successfully logged in!</p>

            <div className="space-x-4">
                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Profile;
