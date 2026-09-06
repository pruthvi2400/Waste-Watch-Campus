/**
 * StatusBadge Component
 * Displays status or severity badges for reports
 */
import React from 'react';

const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  if (type === 'severity') {
    const severityClasses = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-amber-100 text-amber-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'Low': 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${severityClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  }

  // Default to status type
  const statusClasses = {
    'Resolved': 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-amber-100 text-amber-800'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
