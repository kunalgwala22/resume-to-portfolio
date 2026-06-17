import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-[#0A0A0A] py-8 text-center text-sm text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} PortfolioVerse AI. All rights reserved.</p>
        <p className="mt-2 text-xs">Zero-code portfolio generation powered by OpenAI & Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;
