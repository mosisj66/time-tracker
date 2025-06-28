import React from 'react';
import { LogAction } from '../types';
import ActionButton from './ActionButton';
import StatusDisplay from './StatusDisplay';

interface EmployeeViewProps {
  employeeName: string; // Passed from App.tsx based on logged-in user
  isLoggedIn: boolean;
  lastActionTime: Date | null;
  lastActionType: LogAction | null;
  isLoading: boolean;
  handleLogAction: () => void;
  onLogout: () => void;
  successMessage: string | null;
  error: string | null;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({
  employeeName,
  isLoggedIn,
  lastActionTime,
  lastActionType,
  isLoading,
  handleLogAction,
  onLogout,
  successMessage,
  error
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-sky-300">
          ثبت ورود/خروج: <span className="text-cyan-400">{employeeName}</span>
        </h2>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
          disabled={isLoading}
        >
          خروج از سیستم
        </button>
      </div>

      {error && (
        <div className="my-4 p-3 bg-red-700/60 border border-red-500 text-red-200 rounded-md text-sm text-center">
          <p className="font-semibold">خطا!</p>
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="my-4 p-3 bg-green-700/60 border border-green-500 text-green-200 rounded-md text-sm text-center">
          <p>{successMessage}</p>
        </div>
      )}

      <ActionButton
        onClick={handleLogAction}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        disabled={isLoading} // Employee name is now guaranteed by login
      />
      
      <StatusDisplay
        employeeName={employeeName} // Pass employeeName to StatusDisplay
        isLoggedIn={isLoggedIn}
        lastActionTime={lastActionTime}
        lastActionType={lastActionType}
      />
    </div>
  );
};

export default EmployeeView;