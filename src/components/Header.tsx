import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-10">
      <Link href="/" className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
        KanbanFlow
      </Link>
      {/* Add other header elements like user profile, settings, etc. here */}
    </header>
  );
};

export default Header;
