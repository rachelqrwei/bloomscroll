import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#060f18] text-[#faeed7] p-4 z-30">
      <ul className="flex justify-around">
        <li>
          <Link 
            to="/" 
            className={`hover:text-[#ff9aba] transition-colors ${location.pathname === '/' ? 'text-[#ff9aba]' : ''}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/bloomscroll/default" 
            className={`hover:text-[#ff9aba] transition-colors ${location.pathname.startsWith('/bloomscroll') ? 'text-[#ff9aba]' : ''}`}
          >
            BloomScroll
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;



