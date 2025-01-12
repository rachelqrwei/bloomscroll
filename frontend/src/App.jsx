// App.jsx
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Clock from "./components/Clock";
import ProgressBar from "./components/ProgressBar";
import InputModal from "./modal/InputModal";
import LibraryModal from "./modal/librarymodal";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import BloomScroll from "./BloomScroll";
import Profile from "./Profile";

function HomeContent({ progress, streak, onComplete }) {
    const [showInputModal, setShowInputModal] = useState(false);
    const [showLibraryModal, setShowLibraryModal] = useState(false);
    const navigate = useNavigate();

    const handleInputModalClose = (prompt) => {
        setShowInputModal(false);
        if (prompt) {
            onComplete();
            navigate(`/bloomscroll/${prompt}`);
        }
    };

    const handleLibraryModalClose = (prompt) => {
        setShowLibraryModal(false);
        if (prompt) {
            onComplete();
            navigate(`/bloomscroll/${prompt}`);
        }
    };

    return (
        <div className="z-20 flex flex-col items-center justify-center mt-16 mb-20">
            <ProgressBar progress={progress} />
            <Clock />
            <div className="text-[#faeed7] text-xl tracking-tight font-bold flex justify-center items-center font-mono">
                you're on a {streak} day streak!
            </div>

            {/* horizontal divider*/}
            <div className="border-t-2 w-[80%] border-[#faeed7] mt-6"></div>

            <div className="flex flex-col space-y-4 w-full mt-6 max-w-[86%]">
                <button
                    onClick={() => setShowInputModal(true)}
                    className="bg-[#faeed7] text-[#384649] px-6 py-3 rounded-2xl text-left flex items-center justify-start space-x-4"
                >
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                    </svg>
                    <div>
                        <h3 className="font-bold text-lg ">Input a prompt</h3>
                        <p className="text-sm opacity-80 font-mono tracking-[-0.4px]">
                            Generate a feed based on your inputted prompts!
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => setShowLibraryModal(true)}
                    className="bg-[#faeed7] text-[#384649] px-6 py-3 rounded-2xl flex text-left items-center justify-start space-x-4"
                >
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <div>
                        <h3 className="font-bold text-lg ">
                            Browse the library
                        </h3>
                        <p className="text-sm opacity-80 font-mono tracking-[-0.4px] ">
                            Learn something new from our pre-generated topics!
                        </p>
                    </div>
                </button>
            </div>

            {showInputModal && <InputModal onClose={handleInputModalClose} />}
            {showLibraryModal && (
                <LibraryModal onClose={handleLibraryModalClose} />
            )}
        </div>
    );
}

function App() {
    const [progress, setProgress] = useState(57); // Initial progress value
    const [streak, setStreak] = useState(10); // Initial streak value

    const handleCompletion = () => {
        setProgress((prev) => Math.min(prev + 14, 100)); // Ensure progress doesn't exceed 100
        setStreak((prev) => prev + 1);
    };

    return (
        <Router>
            <div className="relative flex flex-col h-screen bg-gradient-to-b from-[#203337] via-[#233132] to-[#30505d]">
                <div
                    className="fixed top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center z-10"
                    style={{ backgroundImage: "url('/indexbg.png')" }}
                ></div>
                <Header />

                <main className="flex z-20 overflow-hidden">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <HomeContent
                                    progress={progress}
                                    streak={streak}
                                    onComplete={handleCompletion}
                                />
                            }
                        />
                        <Route
                            path="/bloomscroll/:prompt"
                            element={
                                <BloomScroll
                                    progress={progress}
                                    streak={streak}
                                />
                            }
                        />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>

                <Navbar />
            </div>
        </Router>
    );
}

export default App;
