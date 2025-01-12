import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Leaf } from "lucide-react";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#060f18] text-[#faeed7] pb-8 p-3 z-30">
            <ul className="flex justify-around">
                <li>
                    <Link
                        to="/"
                        className={`flex flex-col items-center hover:text-[#ffb5aa] transition-colors ${
                            location.pathname === "/" ? "text-[#ffb5aa]" : ""
                        }`}
                    >
                        <Home size={20} className="mb-1" />
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/bloomscroll/default"
                        className={`flex flex-col items-center hover:text-[#ffb5aa] transition-colors ${
                            location.pathname.startsWith("/bloomscroll")
                                ? "text-[#ffb5aa]"
                                : ""
                        }`}
                    >
                        <Leaf size={20} className="mb-1" />
                        BloomScroll
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
