import React from "react";

function Header() {
  return (
    <div className="flex justify-between items-center pb-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hello, Manager</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Track team progress here. You almost reach a goal!
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 text-sm">16 May, 2023</span>
        <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Header;
