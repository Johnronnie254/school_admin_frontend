import { mockTeachers, mockStudents, mockPerformanceData, mockDashboardStats } from './mockData';
import { AxiosResponse } from 'axios';
import { ApiResponse, PerformanceUpdate, Notice } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create mock Axios response
const createAxiosResponse = <T>(data: T): AxiosResponse<ApiResponse<T>> => ({
  data: { success: true, data },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any
});

// Mock API service
const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    await delay(500); // Simulate network delay
    if (email === "admin@school.com" && password === "password") {
      return createAxiosResponse({
        token: "mock-jwt-token",
        user: { 
          id: "1",
          name: "Admin User", 
          email,
          role: "admin" as const
        }
      });
    }
    throw new Error("Invalid credentials");
  },

  register: async (data: { name: string; email: string; password: string }) => {
    await delay(500);
    return createAxiosResponse({ message: "Registration successful" });
  },

  // Teachers endpoints
  getTeachers: async () => {
    await delay(300);
    return mockTeachers;
  },

  addTeacher: async (teacher: any) => {
    await delay(300);
    return { ...teacher, id: String(Math.random()) };
  },

  updateTeacher: async (id: string, teacher: any) => {
    await delay(300);
    return { ...teacher, id };
  },

  deleteTeacher: async (id: string) => {
    await delay(300);
    return { success: true };
  },

  // Students endpoints
  getStudents: async () => {
    await delay(300);
    return mockStudents;
  },

  addStudent: async (student: any) => {
    await delay(300);
    return { ...student, id: Math.random() };
  },

  updateStudent: async (id: number, student: any) => {
    await delay(300);
    return { ...student, id };
  },

  deleteStudent: async (id: number) => {
    await delay(300);
    return { success: true };
  },

  // Performance endpoints
  getPerformanceData: async (grade: string, subject: string) => {
    await delay(300);
    return mockPerformanceData;
  },

  getAllPerformances: async () => {
    await delay(300);
    return createAxiosResponse([
      {
        studentId: "1",
        term: "Term 1",
        grades: [
          {
            subject: "Mathematics",
            marks: 85,
            maxMarks: 100,
            grade: "A",
            examDate: "2024-03-15"
          },
          {
            subject: "Science",
            marks: 92,
            maxMarks: 100,
            grade: "A+",
            examDate: "2024-03-16"
          }
        ],
        attendance: 95,
        remarks: "Excellent performance"
      }
    ]);
  },

  updateGrades: async (studentId: string, performance: PerformanceUpdate) => {
    await delay(300);
    return createAxiosResponse(performance);
  },

  // Dashboard endpoints
  getDashboardStats: async () => {
    await delay(300);
    return createAxiosResponse(mockDashboardStats);
  },

  // File upload mock
  uploadFile: async (file: File) => {
    await delay(1000);
    return { message: "File uploaded successfully" };
  },

  // Fee Management endpoints
  getFeePayments: async () => {
    await delay(300);
    return createAxiosResponse([
      {
        id: "1",
        studentId: "1",
        amount: 15000,
        date: "2024-03-15",
        type: "tuition",
        status: "paid",
        description: "March Tuition Fee (KES)"
      },
      {
        id: "2",
        studentId: "2",
        amount: 2500,
        date: "2024-03-16",
        type: "library",
        status: "pending",
        description: "Library Fee (KES)"
      }
    ]);
  },

  recordFeePayment: async (payment: any) => {
    await delay(300);
    return createAxiosResponse({
      id: String(Math.random()),
      date: new Date().toISOString(),
      status: "paid",
      ...payment
    });
  },

  // Notifications endpoints
  getNotices: async () => {
    await delay(300);
    return createAxiosResponse<Notice[]>([
      {
        id: "1",
        title: "School Holiday",
        content: "School will be closed for summer vacation from June 1st to July 15th",
        date: "2024-03-15",
        author: "Admin",
        type: "general" as const
      },
      {
        id: "2",
        title: "Exam Schedule",
        content: "Final examinations will begin from April 1st",
        date: "2024-03-16",
        author: "Admin",
        type: "academic" as const
      }
    ]);
  },

  createNotice: async (notice: Omit<Notice, 'id'>) => {
    await delay(300);
    return createAxiosResponse({
      ...notice,
      id: String(Math.random())
    });
  },

  updateNotice: async (id: string, notice: Omit<Notice, 'id'>) => {
    await delay(300);
    return createAxiosResponse({
      ...notice,
      id
    });
  },

  deleteNotice: async (id: string) => {
    await delay(300);
    return createAxiosResponse({ success: true });
  },
} as const;

export default api;