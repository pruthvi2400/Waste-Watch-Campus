/**
 * Loading Component
 * A reusable loading spinner
 */
import React from 'react';

const Loading = ({ 
  size = 'md', 
  text = null, 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (fullScreen) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] ${className}`}>
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-emerald-500 ${spinnerSize}`}></div>
        {text && <p className="mt-4 text-gray-500">{text}</p>}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-emerald-500 ${spinnerSize}`}></div>
      {text && <p className="ml-4 text-gray-500">{text}</p>}
    </div>
  );
};

export default Loading;
