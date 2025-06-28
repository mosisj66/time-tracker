import { LogEntry } from '../types';

export const exportLogsToCSV = (logs: LogEntry[]): void => {
  if (logs.length === 0) {
    alert('هیچ داده‌ای برای خروجی گرفتن وجود ندارد.');
    return;
  }

  // Define CSV headers (in Farsi)
  const headers = ['شناسه کارمند', 'نام کارمند', 'عملیات', 'تاریخ', 'زمان'];
  const csvRows = [headers.join(',')];

  // Convert log entries to CSV rows
  logs.forEach(log => {
    const timestamp = new Date(log.timestamp);
    const date = timestamp.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const row = [
      log.id,
      `"${log.employeeName.replace(/"/g, '""')}"`, // Escape double quotes in name
      log.action,
      date,
      time,
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM to help Excel with UTF-8

  const link = document.createElement('a');
  if (link.download !== undefined) { // Check for browser support
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `گزارش_تردد_کارمندان_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    alert('مرورگر شما از قابلیت دانلود مستقیم پشتیبانی نمی‌کند.');
  }
};