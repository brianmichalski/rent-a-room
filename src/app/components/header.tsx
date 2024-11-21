// components/Header.tsx
"use client";
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

// const Header: React.FC<AppProps> = ({ session }) => {
const Header: React.FC = () => {
  const { data: session } = useSession();
  return (
    <nav className="sticky top-0 flex justify-between items-center px-20 py-4 bg-gray-100">
      <div className="text-xl font-bold">RentARoom</div>
      <div>
        {session ? (
          <div className='flex justify-between gap-2'>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              User Menu
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className=" bg-black text-white py-2 px-4 rounded">
              Sign Out
            </button>
          </div>
        ) : (
          <div className='flex justify-between gap-2'>
            <Link
              href="/auth/signin"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Sign-in
            </Link>

            <Link
              href="/auth/register"
              className="hover:text-blue-600 hover:underline py-2 px-4 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;