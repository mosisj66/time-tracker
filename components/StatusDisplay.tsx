import React from 'react';
import { LogAction } from '../types';

interface StatusDisplayProps {
  employeeName: string;
  isLoggedIn: boolean;
  lastActionTime: Date | null;
  lastActionType: LogAction | null;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ employeeName, isLoggedIn, lastActionTime, lastActionType }) => {
  if (!employeeName.trim()) {
     return (
      <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-center" aria-live="polite">
        <p className="text-slate-300">لطفا نام خود را وارد کنید تا وضعیت نمایش داده شود.</p>
      </div>
    );
  }
  
  if (!lastActionTime || !lastActionType) {
    return (
      <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-center" aria-live="polite">
        <p className="text-slate-300">هنوز اقدامی برای <span className="font-medium text-white">{employeeName}</span> ثبت نشده است.</p>
      </div>
    );
  }

  const formattedTime = lastActionTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = lastActionTime.toLocaleDateString('fa-IR');
  
  // Status text should reflect the *current* state (isLoggedIn), not necessarily the last action type if they just changed employee name.
  const currentStatusText = isLoggedIn ? `هم اکنون وارد شده` : `هم اکنون خارج شده`;
  const lastActionText = `آخرین اقدام: ${lastActionType} در تاریخ ${formattedDate} ساعت ${formattedTime}`;
  
  const statusColor = isLoggedIn ? "text-green-400" : "text-yellow-400";

  return (
    <div className="p-4 bg-slate-700/80 border border-slate-600 rounded-lg shadow-md" role="status" aria-live="polite">
      <h3 className="text-lg font-semibold text-sky-300 mb-2">وضعیت فعلی شما ({employeeName}):</h3>
      <p className={`font-semibold ${statusColor}`}>
        {currentStatusText}
      </p>
      <p className="text-slate-300 text-sm mt-1">
        {lastActionText}
      </p>
    </div>
  );
};

export default StatusDisplay;