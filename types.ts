export enum LogAction {
  Login = 'ورود',
  Logout = 'خروج',
}

export interface LogEntry {
  id: string; // Unique ID for each log entry
  employeeName: string; // Keep employeeName for continuity with existing log structure
  timestamp: Date;
  action: LogAction;
}

export interface CalculatedHours {
  employeeName: string;
  totalHours: number;
}

export enum UserRole {
  Employee = 'employee',
  Manager = 'manager',
  None = 'none', // Represents no user logged in
}

export interface User {
  name: string; // For employees, their name. For manager, 'manager' or a specific name.
  role: UserRole;
}

// Represents a registered employee entity
export interface RegisteredEmployee {
  id: string; // Could be same as name if names are unique, or a separate UUID
  name: string;
}