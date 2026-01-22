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
  return null;
}