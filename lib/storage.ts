
export interface AttendanceRecord {
  id: string;
  className: string;
  studentNumber: string;
  date: string; // YYYY-MM-DD
  inTime: string; // HH:mm:ss
  outTime?: string; // HH:mm:ss
}

const STORAGE_KEY = 'attendance_records';
const STUDENT_KEY = 'student_number';

export const getRecords = (): AttendanceRecord[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRecord = (record: AttendanceRecord) => {
  const records = getRecords();
  const index = records.findIndex(r => r.id === record.id);
  if (index > -1) {
    records[index] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getStoredStudentNumber = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STUDENT_KEY);
};

export const setStoredStudentNumber = (num: string) => {
  localStorage.setItem(STUDENT_KEY, num);
};

export const getRecordForToday = (studentNumber: string, className: string, date: string): AttendanceRecord | undefined => {
  const records = getRecords();
  return records.find(r => r.studentNumber === studentNumber && r.className === className && r.date === date);
};
