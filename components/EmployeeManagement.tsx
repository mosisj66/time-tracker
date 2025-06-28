import React, { useState } from 'react';
import { RegisteredEmployee } from '../types';
import LoadingIcon from './LoadingIcon';

interface EmployeeManagementProps {
  employees: RegisteredEmployee[];
  onAddEmployee: (name: string) => Promise<void>;
  isLoading: boolean;
  clearMessages: () => void; // To clear global messages on input focus
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, onAddEmployee, isLoading, clearMessages }) => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);


  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    clearMessages(); // Clear global messages from App.tsx
    if (!newEmployeeName.trim()) {
      setAddError('نام کارمند نمی‌تواند خالی باشد.');
      return;
    }
    try {
      await onAddEmployee(newEmployeeName);
      setNewEmployeeName(''); // Clear input on success
    } catch (error: any) {
      setAddError(error.message || 'خطا در افزودن کارمند.');
    }
  };
  
  const handleInputFocus = () => {
    setAddError(null);
    clearMessages();
  };

  return (
    <div className="p-6 bg-slate-700/60 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-sky-300 mb-4">مدیریت کارمندان</h3>
      
      <form onSubmit={handleAddSubmit} className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:space-x-3 rtl:sm:space-x-reverse items-start">
        <div className="flex-grow">
          <label htmlFor="newEmployeeName" className="sr-only">نام کارمند جدید</label>
          <input
            type="text"
            id="newEmployeeName"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="نام و نام خانوادگی کارمند جدید"
            className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !newEmployeeName.trim()}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-slate-500 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingIcon className="w-5 h-5" /> : 'افزودن کارمند'}
        </button>
      </form>
      {addError && <p className="text-red-400 text-sm mb-4">{addError}</p>}


      <h4 className="text-lg font-medium text-sky-300 mb-3">لیست کارمندان ثبت شده:</h4>
      {employees.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto bg-slate-600/50 p-3 rounded-md custom-scrollbar">
          {employees.map(emp => (
            <li key={emp.id} className="px-3 py-2 bg-slate-500/30 rounded text-slate-200">
              {emp.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">هنوز هیچ کارمندی ثبت نشده است.</p>
      )}
    </div>
  );
};

export default EmployeeManagement;