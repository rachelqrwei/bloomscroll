import React, { useState } from 'react';

function InputModal({ onClose }) {
    const [input, setInput] = useState('');
    const [showWarning, setShowWarning] = useState(false);

    const handleStart = () => {
        if (!input.trim()) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
            console.log('Starting Bloomscrolling with input:', input);
            onClose(input.trim());
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => onClose()}
        >
            <div
                className="flex-col bg-[#e7dfd8] rounded-2xl p-6 w-[90%] z-100 items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-[#384649] mb-4 text-center">Bloomscroll Initiation</h2>

                {showWarning && (
                    <p className="text-red-500 text-sm font-bold mb-2 text-center">Please input a topic!</p>
                )}

                <textarea
                    className="w-full px-4 py-2 mb-4 text-center items-center justify-center border border-gray-300 rounded-lg text-[#384649] bg-white"
                    placeholder="Enter your prompt here"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (e.target.value.trim()) setShowWarning(false);
                    }}
                    style={{ lineHeight: '1.5', textAlign: 'center' }}
                />

                <button
                    className="w-full bg-[#205e63] text-[#faeed7] font-bold py-3 px-4 rounded-lg"
                    onClick={handleStart}
                >
                    Start Bloomscrolling!
                </button>
            </div>
        </div>
    );
}

export default InputModal;

