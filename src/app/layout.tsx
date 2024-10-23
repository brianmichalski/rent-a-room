// components/Layout.tsx
import React, { ReactNode } from 'react';
import '../styles/globals.css'; // Adjust path if necessary
import Header from './components/header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
