// components/Layout.tsx
"use client";
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import '../styles/globals.css'; // Adjust path if necessary

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
