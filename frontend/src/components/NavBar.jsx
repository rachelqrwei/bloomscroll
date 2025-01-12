import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Leaf } from "lucide-react";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#060f18] text-[#faeed7] pb-6 p-4 z-30">
      <ul className="flex justify-around">
        <li>
          <Link 
            to="/" 
            className={`flex flex-col items-center hover:text-[#ff9aba] transition-colors ${location.pathname === '/' ? 'text-[#ff9aba]' : ''}`}
          >
            <Home size={20} className="mb-1" />
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/bloomscroll/default" 
            className={`flex flex-col items-center hover:text-[#ff9aba] transition-colors ${location.pathname.startsWith('/bloomscroll') ? 'text-[#ff9aba]' : ''}`}
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