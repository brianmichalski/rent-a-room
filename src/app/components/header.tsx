// components/Header.tsx
"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <nav className="sticky top-0 flex justify-between items-center px-20 py-4 bg-gray-100">
      <div className="text-xl font-bold">RentARoom</div>
      <div>
        {isLoggedIn ? (
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            User Menu
          </button>
        ) : (
          <div className='flex justify-between gap-2'>
            <Link
              href="/auth/signin"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Sign-in
            </Link>

            <Link
              href="/auth/signin"
              className=" hover:bg-black hover:text-white py-2 px-4 rounded"
            >
              Subscribe
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;