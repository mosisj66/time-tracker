import React from 'react';
import { LogEntry } from '../types';

interface LogTableProps {
  logs: LogEntry[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
   const sortedLogs = [...logs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (sortedLogs.length === 0) {
    return <p className="text-slate-400 text-center">هیچ گزارشی برای نمایش وجود ندارد.</p>;
  }

  return (
    <div className="overflow-x-auto bg-slate-700/70 rounded-lg shadow max-h-96"> {/* Added max-h-96 for scrollability */}
      <table className="min-w-full text-sm text-right text-slate-200">
        <thead className="bg-slate-700 text-xs uppercase text-sky-300 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-6 py-3">
              نام کارمند
            </th>
            <th scope="col" className="px-6 py-3">
              عملیات
            </th>
            <th scope="col" className="px-6 py-3">
              تاریخ
            </th>
            <th scope="col" className="px-6 py-3">
              زمان
            </th>
             <th scope="col" className="px-6 py-3">
              شناسه رویداد
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-600">
          {sortedLogs.map((log) => {
            const timestamp = new Date(log.timestamp);
            return (
              <tr key={log.id} className="hover:bg-slate-600/50 transition-colors">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {log.employeeName}
                </td>
                <td className={`px-6 py-4 ${log.action === 'ورود' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {log.action}
                </td>
                <td className="px-6 py-4">
                  {timestamp.toLocaleDateString('fa-IR')}
                </td>
                <td className="px-6 py-4">
                  {timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {log.id.substring(0,8)}...
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;