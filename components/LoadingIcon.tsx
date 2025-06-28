import React from 'react';

interface LoadingIconProps {
  className?: string;
  // Add title for accessibility if needed, though for purely decorative spinners it might be empty
  title?: string; 
}

const LoadingIcon: React.FC<LoadingIconProps> = ({ className, title = "در حال بارگذاری" }) => {
  return (
    <svg 
      className={`animate-spin ${className || 'h-5 w-5 text-white'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      role="img" // Role can be "status" or "progressbar" if it represents loading progress
      aria-label={title} // More descriptive label
    >
      {title && <title>{title}</title>}
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default LoadingIcon;