import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

function Header() {
    const location = useLocation();
    const tabName =
        location.pathname === "/"
            ? "Home"
            : location.pathname.startsWith("/bloomscroll")
            ? "Bloomscroll"
            : "Profile";
    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/");
    };

    return (
        <header className="flex gap-2 bg-[#060f18] text-[#faeed7] p-4 w-full text-left fixed top-0 left-0 right-0 z-30 border-b-[1px] border-gray-700">
            <img src="/favicon.png" className="w-6 h-6" onClick={handleHome} />
            <h1 className="text-l ">{tabName}</h1>
        </header>
    );
}

export default Header;
