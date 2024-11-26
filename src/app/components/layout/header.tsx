// components/Header.tsx
"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import HomeLink from './home-link';
import UserMenu from './user-menu';

// const Header: React.FC<AppProps> = ({ session }) => {
const Header: React.FC = () => {
  const { data: session } = useSession();
  return (
    <nav className="sticky top-0 flex justify-between items-center px-20 py-4 bg-custom-blue">
      <div className="flex items-center gap-x-2 text-xl font-bold">
        <HomeLink />
        RentARoom
      </div>
      <div>
        {session ? (
          <div className='flex justify-between gap-2'>
            <UserMenu />
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