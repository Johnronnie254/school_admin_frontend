// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'staff';
}

// Student Types
export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  class: string;
  rollNumber: string;
  parentName: string;
  contactNumber: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
}

// Teacher Types
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  qualification: string;
  experience: number;
  contactNumber: string;
  address: string;
  joiningDate: string;
}

// Performance Types
export interface Grade {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  examDate: string;
}

export interface PerformanceUpdate {
  studentId: string;
  term: string;
  grades: Grade[];
  attendance: number;
  remarks: string;
}

export interface Performance extends PerformanceUpdate {
  id?: string;
}

// Fee Types
export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  type: string;
  status: string;
  description: string;
}

// Notice Types
export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'general' | 'academic' | 'event';
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  upcomingEvents: Event[];
  recentNotices: Notice[];
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'academic' | 'cultural' | 'sports' | 'other';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
} 