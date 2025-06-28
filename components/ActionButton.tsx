import React from 'react';
import LoadingIcon from './LoadingIcon';
import { LogAction } from '../types';

interface ActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  disabled: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isLoading, isLoggedIn, disabled }) => {
  const buttonText = isLoggedIn ? LogAction.Logout : LogAction.Login;
  const buttonBaseClasses = "w-full flex items-center justify-center font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4";
  const enabledClasses = isLoggedIn 
    ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white focus:ring-orange-400/50 shadow-lg hover:shadow-orange-500/40"
    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white focus:ring-sky-400/50 shadow-lg hover:shadow-sky-500/40";
  const disabledClasses = "bg-slate-600 text-slate-400 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${buttonBaseClasses} ${isLoading || disabled ? disabledClasses : enabledClasses}`}
      aria-live="polite" // Announces changes when isLoading state changes
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingIcon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          <span>در حال پردازش...</span>
        </>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default ActionButton;