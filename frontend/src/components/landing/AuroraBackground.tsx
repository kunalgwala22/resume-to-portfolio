import React from 'react';

export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-dark overflow-hidden flex flex-col justify-between w-full">
      {/* Gradient orbs layer */}
      <div className="absolute inset-0 bg-dark pointer-events-none z-0">
        <div className="absolute -top-[40%] -left-[20%] w-[85%] h-[85%] rounded-full bg-primary/15 blur-[140px] animate-aurora dark:mix-blend-screen mix-blend-multiply"></div>
        <div className="absolute -bottom-[40%] -right-[20%] w-[85%] h-[85%] rounded-full bg-secondary/10 blur-[140px] animate-aurora dark:mix-blend-screen mix-blend-multiply" style={{ animationDelay: '-4s' }}></div>
      </div>
      
      {/* Mesh grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--color-border))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--color-border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full flex-grow flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
