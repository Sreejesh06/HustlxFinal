import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

export function HustlxLogo({ className = "h-8 w-auto", variant = "default" }: LogoProps) {
  // Color variables based on variant
  const primaryColor = variant === 'light' ? '#FFFFFF' : 
                     variant === 'dark' ? '#1A202C' : 
                     '#0F766E'; // teal-700 as default
  
  const secondaryColor = variant === 'light' ? '#CBD5E0' : 
                       variant === 'dark' ? '#4A5568' : 
                       '#14B8A6'; // teal-500 as default
  
  const accentColor = variant === 'light' ? '#E2E8F0' : 
                    variant === 'dark' ? '#718096' : 
                    '#5EEAD4'; // teal-300 as default

  return (
    <svg
      className={className}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mechanical Gear Elements */}
      <circle cx="18" cy="20" r="16" fill={secondaryColor} opacity="0.1" />
      <circle cx="18" cy="20" r="13" stroke={secondaryColor} strokeWidth="1.5" />
      <circle cx="18" cy="20" r="7" fill={accentColor} opacity="0.3" />
      <circle cx="18" cy="20" r="3" fill={primaryColor} />
      
      {/* Gear Teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect
          key={i}
          x="16"
          y="0"
          width="4"
          height="7"
          rx="1"
          fill={primaryColor}
          transform={`rotate(${angle} 18 20)`}
        />
      ))}
      
      {/* Text Elements */}
      <path
        d="M39 15h4v16h-4V15zm10 0h4v3h-4v-3zm0 5h4v11h-4V20zm11 0h4v11h-4V20zm0-5h4v3h-4v-3zm11 0h4v16h-4V15zm10 0h4v16h-4V15zm11 0h4v16h-4V15zm-11 0h4v3h-4v-3zm0 13h4v3h-4v-3z"
        fill={primaryColor}
      />
      
      {/* X with Dynamic Mechanical Element */}
      <path
        d="M96 15l6 8-6 8h5l3.5-4.6L108 31h5l-6-8 6-8h-5l-3.5 4.6L101 15h-5z"
        fill={primaryColor}
      />
      
      {/* Accent Detail */}
      <circle cx="114" cy="15" r="2" fill={accentColor} />
    </svg>
  );
}