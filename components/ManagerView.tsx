import React, { useMemo, useState } from 'react';
import { LogEntry, LogAction, CalculatedHours, RegisteredEmployee } from '../types';
import { exportLogsToCSV } from '../services/csvExporter';
import HoursSummaryTable from './HoursSummaryTable';
import LogTable from './LogTable';
import EmployeeManagement from './EmployeeManagement'; // New component

interface ManagerViewProps {
  logs: LogEntry[];
  onLogout: () => void;
  registeredEmployees: RegisteredEmployee[];
  onAddEmployee: (name: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  clearMessages: () => void;
}

const ManagerView: React.FC<ManagerViewProps> = ({
  logs,
  onLogout,
  registeredEmployees,
  onAddEmployee,
  isLoading,
  error,
  successMessage,
  clearMessages
}) => {
  const calculatedHours = useMemo((): CalculatedHours[] => {
    const employeeData: { [key: string]: { entries: LogEntry[], totalMillis: number } } = {};

    logs.forEach(log => {
      if (!employeeData[log.employeeName]) {
        employeeData[log.employeeName] = { entries: [], totalMillis: 0 };
      }
      employeeData[log.employeeName].entries.push({
        ...log,
        timestamp: new Date(log.timestamp) 
      });
    });

    for (const name in employeeData) {
      const sortedEntries = employeeData[name].entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      let lastLoginTime: Date | null = null;
      for (const entry of sortedEntries) {
        if (entry.action === LogAction.Login) {
          lastLoginTime = entry.timestamp;
        } else if (entry.action === LogAction.Logout && lastLoginTime) {
          employeeData[name].totalMillis += (entry.timestamp.getTime() - lastLoginTime.getTime());
          lastLoginTime = null; 
        }
      }
    }
    
    return Object.entries(employeeData).map(([name, data]) => ({
      employeeName: name,
      totalHours: parseFloat((data.totalMillis / (1000 * 60 * 60)).toFixed(2)),
    })).sort((a,b) => b.totalHours - a.totalHours);
  }, [logs]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-semibold text-sky-300">داشبورد مدیر</h2>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
        >
          خروج از سیستم
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-700/60 border border-red-500 text-red-200 rounded-md text-sm text-center">
          <p className="font-semibold">خطا!</p>
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-700/60 border border-green-500 text-green-200 rounded-md text-sm text-center">
          <p>{successMessage}</p>
        </div>
      )}

      <EmployeeManagement 
        employees={registeredEmployees} 
        onAddEmployee={onAddEmployee}
        isLoading={isLoading}
        clearMessages={clearMessages}
      />

      <div>
        <h3 className="text-2xl font-semibold text-sky-300 mb-4">مجموع ساعات حضور کارمندان</h3>
        {calculatedHours.length > 0 ? (
           <HoursSummaryTable hoursData={calculatedHours} />
        ) : (
          <p className="text-slate-400 p-4 bg-slate-700/50 rounded-md">داده کافی برای محاسبه مجموع ساعات وجود ندارد یا هیچ دوره ورود/خروج کاملی ثبت نشده است.</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-sky-300">گزارش کامل ترددها</h3>
          {logs.length > 0 && (
            <button
              onClick={() => exportLogsToCSV(logs)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            >
              خروجی CSV تمام رویدادها
            </button>
          )}
        </div>
        {logs.length > 0 ? (
          <LogTable logs={logs} />
        ) : (
           <p className="text-slate-400 p-4 bg-slate-700/50 rounded-md">هنوز هیچ گزارشی برای نمایش وجود ندارد.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerView;