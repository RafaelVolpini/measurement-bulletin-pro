import React from 'react';

interface BoletimLogoProps {
  logoUrl?: string;
  className?: string;
}

export function BoletimLogo({ logoUrl, className = '' }: BoletimLogoProps) {
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt="Logo da empresa" 
        className={`max-h-16 object-contain ${className}`}
      />
    );
  }

  // Default TSA-style logo
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        viewBox="0 0 60 50" 
        className="h-12 w-14"
        fill="none"
      >
        {/* Diamond shape with lines */}
        <path 
          d="M30 5 L45 25 L30 45 L15 25 Z" 
          stroke="hsl(0 70% 32%)" 
          strokeWidth="2" 
          fill="none"
        />
        <line x1="22" y1="18" x2="38" y2="18" stroke="hsl(0 70% 32%)" strokeWidth="2"/>
        <line x1="20" y1="25" x2="40" y2="25" stroke="hsl(0 70% 32%)" strokeWidth="2"/>
        <line x1="22" y1="32" x2="38" y2="32" stroke="hsl(0 70% 32%)" strokeWidth="2"/>
      </svg>
      <span className="text-3xl font-bold text-primary">TSA</span>
    </div>
  );
}
