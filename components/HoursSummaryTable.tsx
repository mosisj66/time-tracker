import React from 'react';
import { CalculatedHours } from '../types';

interface HoursSummaryTableProps {
  hoursData: CalculatedHours[];
}

const HoursSummaryTable: React.FC<HoursSummaryTableProps> = ({ hoursData }) => {
  if (hoursData.length === 0) {
    return <p className="text-slate-400 text-center">داده‌ای برای نمایش مجموع ساعات وجود ندارد.</p>;
  }

  return (
    <div className="overflow-x-auto bg-slate-700/70 rounded-lg shadow">
      <table className="min-w-full text-sm text-right text-slate-200">
        <thead className="bg-slate-700 text-xs uppercase text-sky-300">
          <tr>
            <th scope="col" className="px-6 py-3">
              نام کارمند
            </th>
            <th scope="col" className="px-6 py-3">
              مجموع ساعات حضور (ساعت)
            </th>
          </tr>
        </thead>
        <tbody>
          {hoursData.map(({ employeeName, totalHours }) => (
            <tr key={employeeName} className="border-b border-slate-600 hover:bg-slate-600/50 transition-colors">
              <td className="px-6 py-4 font-medium whitespace-nowrap">
                {employeeName}
              </td>
              <td className="px-6 py-4">
                {totalHours.toLocaleString('fa-IR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoursSummaryTable;