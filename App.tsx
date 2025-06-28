
import React, { useState, useEffect, useCallback } from 'react';
import { generateManagerNotification } from './services/geminiService';
import { LogAction, LogEntry, User, UserRole, RegisteredEmployee } from './types';
import EmployeeView from './components/EmployeeView';
import ManagerView from './components/ManagerView';
import LoginScreen from './components/LoginScreen';
import { addLogEntry, getLogsForEmployee, getAllLogs, getRegisteredEmployees, addRegisteredEmployee as saveNewEmployee, initializeAuthData } from './services/localStorageService';
import { authenticateUser, RegisteredUser } from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedInToSystem, setIsLoggedInToSystem] = useState<boolean>(false); // Tracks if anyone is logged in

  // Employee specific state (when currentUser is an employee)
  const [isEmployeeClockedIn, setIsEmployeeClockedIn] = useState<boolean>(false);
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);
  const [lastActionType, setLastActionType] = useState<LogAction | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manager specific state
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [registeredEmployees, setRegisteredEmployees] = useState<RegisteredEmployee[]>([]);

  useEffect(() => {
    initializeAuthData(); // Setup default manager/employees if not present
    const employees = getRegisteredEmployees();
    setRegisteredEmployees(employees);
    if (currentUser?.role === UserRole.Manager) {
      setAllLogs(getAllLogs());
    }
  }, [currentUser?.role]);


  // Effect to update employee's clock-in status when currentUser (employee) changes
  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.Employee) {
      const employeeLogs = getLogsForEmployee(currentUser.name).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (employeeLogs.length > 0) {
        const lastLog = employeeLogs[0];
        setIsEmployeeClockedIn(lastLog.action === LogAction.Login);
        setLastActionTime(new Date(lastLog.timestamp));
        setLastActionType(lastLog.action);
      } else {
        setIsEmployeeClockedIn(false);
        setLastActionTime(null);
        setLastActionType(null);
      }
      setSuccessMessage(null); // Clear messages when employee context changes
      setError(null);
    }
  }, [currentUser]);


  const handleLogin = async (nameOrPassword: string, role: UserRole.Employee | UserRole.Manager, employeeName?: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const user = await authenticateUser(nameOrPassword, role, employeeName); // employeeName is used for role Employee
      if (user) {
        setCurrentUser(user);
        setIsLoggedInToSystem(true);
        if (user.role === UserRole.Manager) {
          setAllLogs(getAllLogs()); // Load all logs for manager
          setRegisteredEmployees(getRegisteredEmployees()); // Load employees for manager
        }
        // Employee status (isEmployeeClockedIn, lastActionTime, etc.) will be set by the useEffect listening to currentUser changes.
      } else {
        setError('نام کاربری یا کلمه عبور نامعتبر است.');
      }
    } catch (authError: any) {
      setError(authError.message || 'خطا در فرآیند ورود.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedInToSystem(false);
    setIsEmployeeClockedIn(false);
    setLastActionTime(null);
    setLastActionType(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleEmployeeLogAction = useCallback(async () => {
    if (!currentUser || currentUser.role !== UserRole.Employee) {
      setError('کاربر نامعتبر است.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const currentAction = isEmployeeClockedIn ? LogAction.Logout : LogAction.Login;
    const currentTime = new Date();

    try {
      await generateManagerNotification({
        employeeName: currentUser.name,
        action: currentAction,
        time: currentTime,
      });

      const newLogEntry: LogEntry = {
        id: crypto.randomUUID(),
        employeeName: currentUser.name,
        action: currentAction,
        timestamp: currentTime,
      };
      addLogEntry(newLogEntry);
      
      // Update employee specific state
      setIsEmployeeClockedIn(!isEmployeeClockedIn);
      setLastActionTime(currentTime);
      setLastActionType(currentAction);
      setSuccessMessage(currentAction === LogAction.Login ? 'ورود با موفقیت ثبت شد.' : 'خروج با موفقیت ثبت شد.');
      
      // The following block was removed as it's unreachable:
      // if (currentUser.role === UserRole.Manager) { 
      //   setAllLogs(getAllLogs());
      // }
      // The manager's logs are updated when the manager logs in or adds an employee.

    } catch (err) {
      console.error(err);
      const errorMessage = (err instanceof Error) ? err.message : 'یک خطای ناشناخته در ثبت تردد رخ داد.';
      setError(`خطا: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isEmployeeClockedIn]);

  const handleAddEmployee = (name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!name.trim()) {
        setError("نام کارمند نمی‌تواند خالی باشد.");
        reject(new Error("نام کارمند نمی‌تواند خالی باشد."));
        return;
      }
      try {
        const newEmployee = saveNewEmployee(name);
        setRegisteredEmployees(getRegisteredEmployees()); // Refresh employee list
        setSuccessMessage(`کارمند "${newEmployee.name}" با موفقیت اضافه شد.`);
        setError(null);
        resolve();
      } catch (e: any) {
        setError(e.message);
        setSuccessMessage(null);
        reject(e);
      }
    });
  };

  const renderContent = () => {
    if (!isLoggedInToSystem || !currentUser) {
      return (
        <LoginScreen
          onLogin={handleLogin}
          isLoading={isLoading}
          error={error}
          registeredEmployees={registeredEmployees.map(emp => ({ id: emp.id, name: emp.name } as RegisteredUser))}
        />
      );
    }

    switch (currentUser.role) {
      case UserRole.Employee:
        return (
          <EmployeeView
            employeeName={currentUser.name}
            isLoggedIn={isEmployeeClockedIn}
            lastActionTime={lastActionTime}
            lastActionType={lastActionType}
            isLoading={isLoading}
            handleLogAction={handleEmployeeLogAction}
            onLogout={handleLogout}
            successMessage={successMessage}
            error={error}
          />
        );
      case UserRole.Manager:
        return (
          <ManagerView
            logs={allLogs}
            onLogout={handleLogout}
            registeredEmployees={registeredEmployees}
            onAddEmployee={handleAddEmployee}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            clearMessages={() => { setError(null); setSuccessMessage(null);}}
          />
        );
      default:
        setError("نقش کاربر نامشخص است.");
        // Fallback to login screen or an error display
        return <LoginScreen onLogin={handleLogin} isLoading={isLoading} error={error || "نقش کاربر نامشخص."} registeredEmployees={registeredEmployees.map(emp => ({id: emp.id, name: emp.name}  as RegisteredUser))} />;
    }
  };
  
  // Centralized message display area, could be part of a layout component
  const globalMessages = (
    <>
      {error && !isLoading && (!currentUser || (currentUser.role !== UserRole.Employee && currentUser.role !== UserRole.Manager)) && (
        <div className="my-4 p-3 bg-red-700/60 border border-red-500 text-red-200 rounded-md text-sm text-center">
          <p className="font-semibold">خطا!</p>
          <p>{error}</p>
        </div>
      )}
      {successMessage && !isLoading && (!currentUser || (currentUser.role !== UserRole.Employee && currentUser.role !== UserRole.Manager)) && (
         <div className="my-4 p-3 bg-green-700/60 border border-green-500 text-green-200 rounded-md text-sm text-center">
          <p>{successMessage}</p>
        </div>
      )}
    </>
  );


  return (
    <div className="container mx-auto max-w-2xl p-6 bg-slate-800 shadow-2xl rounded-xl min-h-[70vh] flex flex-col">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          سیستم ثبت تردد کارمندان
        </h1>
        {isLoggedInToSystem && currentUser && (
             <p className="text-slate-400 mt-2">
                خوش آمدید، {currentUser.role === UserRole.Manager ? 'مدیر سیستم' : currentUser.name}
             </p>
        )}
      </header>
      
      {/* Global messages for login screen specifically */}
      {!isLoggedInToSystem && globalMessages}

      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <footer className="mt-8 pt-4 border-t border-slate-700 text-center text-xs text-slate-500">
        طراحی شده با React، Tailwind و Gemini API
      </footer>
    </div>
  );
};

export default App;
