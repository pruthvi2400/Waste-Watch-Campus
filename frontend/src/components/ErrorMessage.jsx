/**
 * ErrorMessage Component
 * A reusable error display component
 */
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  onDismiss = null, 
  variant = 'default',
  className = '' 
}) => {
  if (!message) return null;

  const variantClasses = {
    default: 'bg-red-50 border-l-4 border-red-400 text-red-700',
    warning: 'bg-amber-50 border-l-4 border-amber-400 text-amber-700',
    info: 'bg-blue-50 border-l-4 border-blue-400 text-blue-700'
  };

  return (
    <div className={`${variantClasses[variant] || variantClasses.default} p-4 rounded flex items-start space-x-2 ${className}`}>
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-grow">
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
