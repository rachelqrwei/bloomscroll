import { useLocation } from "react-router-dom";
import React from "react";

function Header() {
  const location = useLocation();
  const tabName = location.pathname === '/' ? 'Home' : 'Bloomscroll';

  return (
    <header className="bg-[#060f18] text-[#faeed7] p-4 w-full text-left fixed top-0 left-0 right-0 z-30 border-b-[1px] border-gray-700">
      <h1 className="text-l font-bold">{tabName}</h1>
    </header>
  );
}

export default Header;


