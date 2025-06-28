import { User, UserRole, RegisteredEmployee } from '../types';
import { getRegisteredEmployees, getManagerPassword } from './localStorageService';

export interface RegisteredUser {
    id: string;
    name: string;
}

export const authenticateUser = (
  identifier: string, // For employee: name. For manager: password.
  role: UserRole.Employee | UserRole.Manager,
  employeeNameForLogin?: string // Only used when role is Employee
): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate async operation
      if (role === UserRole.Employee) {
        const employees = getRegisteredEmployees();
        const foundEmployee = employees.find(emp => emp.name === employeeNameForLogin);
        if (foundEmployee) {
          resolve({ name: foundEmployee.name, role: UserRole.Employee });
        } else {
          reject(new Error('کارمند با این نام یافت نشد.'));
        }
      } else if (role === UserRole.Manager) {
        const managerPassword = getManagerPassword();
        if (identifier === managerPassword) {
          resolve({ name: 'مدیر سیستم', role: UserRole.Manager });
        } else {
          reject(new Error('کلمه عبور مدیر اشتباه است.'));
        }
      } else {
        reject(new Error('نقش کاربری نامعتبر است.'));
      }
    }, 200); // Simulate network delay
  });
};
