import { LogEntry, RegisteredEmployee } from '../types';

const LOGS_STORAGE_KEY = 'employeeAttendanceLogs_v2'; // Updated key to avoid conflicts
const REGISTERED_EMPLOYEES_KEY = 'registeredEmployees_v2';
const MANAGER_PASSWORD_KEY = 'managerPassword_v2';

const DEFAULT_EMPLOYEES: RegisteredEmployee[] = [
  { id: crypto.randomUUID(), name: 'محسن جمالی' },
  { id: crypto.randomUUID(), name: 'مجتبی ایمانی' },
  { id: crypto.randomUUID(), name: 'سحر دلاور' },
];
const DEFAULT_MANAGER_PASSWORD = '1234'; // Store plaintext for simplicity in this example

// Initialize default data if not present
export const initializeAuthData = (): void => {
  if (!localStorage.getItem(REGISTERED_EMPLOYEES_KEY)) {
    localStorage.setItem(REGISTERED_EMPLOYEES_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
  }
  if (!localStorage.getItem(MANAGER_PASSWORD_KEY)) {
    localStorage.setItem(MANAGER_PASSWORD_KEY, DEFAULT_MANAGER_PASSWORD);
  }
};

// --- Employee Management ---
export const getRegisteredEmployees = (): RegisteredEmployee[] => {
  try {
    const storedEmployees = localStorage.getItem(REGISTERED_EMPLOYEES_KEY);
    return storedEmployees ? JSON.parse(storedEmployees) : [];
  } catch (error) {
    console.error("Error retrieving registered employees:", error);
    return [];
  }
};

export const addRegisteredEmployee = (name: string): RegisteredEmployee => {
  if (!name.trim()) {
    throw new Error("نام کارمند نمی‌تواند خالی باشد.");
  }
  const currentEmployees = getRegisteredEmployees();
  if (currentEmployees.some(emp => emp.name.toLowerCase() === name.trim().toLowerCase())) {
    throw new Error(`کارمندی با نام "${name}" قبلا ثبت شده است.`);
  }
  const newEmployee: RegisteredEmployee = { id: crypto.randomUUID(), name: name.trim() };
  currentEmployees.push(newEmployee);
  try {
    localStorage.setItem(REGISTERED_EMPLOYEES_KEY, JSON.stringify(currentEmployees));
    return newEmployee;
  } catch (error) {
    console.error("Error saving new employee:", error);
    throw new Error("خطا در ذخیره سازی کارمند جدید.");
  }
};

// --- Manager Password ---
export const getManagerPassword = (): string | null => {
  return localStorage.getItem(MANAGER_PASSWORD_KEY);
};

// --- Log Management ---
export const getAllLogs = (): LogEntry[] => {
  try {
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    if (storedLogs) {
      return JSON.parse(storedLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error retrieving all logs:", error);
  }
  return [];
};

export const getLogsForEmployee = (employeeName: string): LogEntry[] => {
  return getAllLogs().filter(log => log.employeeName === employeeName);
};

export const addLogEntry = (newEntry: LogEntry): void => {
  try {
    const currentLogs = getAllLogs();
    currentLogs.push(newEntry);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(currentLogs));
  } catch (error) {
    console.error("Error saving log entry:", error);
  }
};

export const clearAllData = (): void => { // For testing or complete reset
  try {
    localStorage.removeItem(LOGS_STORAGE_KEY);
    localStorage.removeItem(REGISTERED_EMPLOYEES_KEY);
    localStorage.removeItem(MANAGER_PASSWORD_KEY);
    console.log("All application data cleared from localStorage.");
  } catch (error) {
    console.error("Error clearing all data:", error);
  }
};