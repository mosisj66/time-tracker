import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import LoadingIcon from './LoadingIcon';
import { RegisteredUser } from '../services/authService'; // For employee dropdown

interface LoginScreenProps {
  onLogin: (nameOrPassword: string, role: UserRole.Employee | UserRole.Manager, employeeName?: string) => void;
  isLoading: boolean;
  error: string | null;
  registeredEmployees: RegisteredUser[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading, error, registeredEmployees }) => {
  const [loginMode, setLoginMode] = useState<UserRole.Employee | UserRole.Manager>(UserRole.Employee);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [managerPassword, setManagerPassword] = useState<string>('');

  useEffect(() => {
    // Pre-select first employee if list is available and none selected
    if (loginMode === UserRole.Employee && registeredEmployees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(registeredEmployees[0].name);
    }
  }, [loginMode, registeredEmployees, selectedEmployee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMode === UserRole.Employee) {
      if (!selectedEmployee) {
        // This should ideally be handled by disabling the button or providing a more specific error
        alert('لطفا یک کارمند را انتخاب کنید.'); 
        return;
      }
      onLogin(selectedEmployee, UserRole.Employee, selectedEmployee);
    } else {
      onLogin(managerPassword, UserRole.Manager);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-700 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-sky-300 mb-8">ورود به سیستم</h2>

        <div className="mb-6">
          <div className="flex border-b border-slate-600">
            <button
              onClick={() => setLoginMode(UserRole.Employee)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                loginMode === UserRole.Employee 
                ? 'text-sky-400 border-b-2 border-sky-400' 
                : 'text-slate-400 hover:text-sky-300'
              }`}
            >
              ورود کارمند
            </button>
            <button
              onClick={() => setLoginMode(UserRole.Manager)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                loginMode === UserRole.Manager 
                ? 'text-sky-400 border-b-2 border-sky-400' 
                : 'text-slate-400 hover:text-sky-300'
              }`}
            >
              ورود مدیر
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/80 border border-red-500 text-red-100 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {loginMode === UserRole.Employee ? (
            <div>
              <label htmlFor="employeeSelect" className="block text-sm font-medium text-sky-300 mb-1">
                انتخاب کارمند:
              </label>
              <select
                id="employeeSelect"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
                disabled={isLoading || registeredEmployees.length === 0}
              >
                {registeredEmployees.length === 0 ? (
                    <option value="" disabled>هیچ کارمندی ثبت نشده است</option>
                ) : (
                    registeredEmployees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))
                )}
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="managerPassword" className="block text-sm font-medium text-sky-300 mb-1">
                کلمه عبور مدیر:
              </label>
              <input
                type="password"
                id="managerPassword"
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
                placeholder="کلمه عبور"
                className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (loginMode === UserRole.Employee && !selectedEmployee)}
            className="w-full flex items-center justify-center font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white focus:ring-sky-400/50 shadow-lg hover:shadow-sky-500/40 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingIcon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                <span>در حال ورود...</span>
              </>
            ) : (
              'ورود'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;