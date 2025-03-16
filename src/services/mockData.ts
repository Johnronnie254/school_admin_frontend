// Mock data for the application
export const mockTeachers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@school.com",
    subject: "Mathematics",
    qualification: "M.Sc Mathematics",
    experience: 5,
    contactNumber: "123-456-7890",
    address: "123 Education St",
    joiningDate: "2023-01-15"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@school.com",
    subject: "English",
    qualification: "M.A. English Literature",
    experience: 8,
    contactNumber: "098-765-4321",
    address: "456 Learning Ave",
    joiningDate: "2022-08-20"
  }
];

export const mockStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    guardian: "Bob Johnson",
    contact: "111-222-3333"
  },
  {
    id: 2,
    name: "Charlie Brown",
    guardian: "Diana Brown",
    contact: "444-555-6666"
  }
];

export const mockPerformanceData = {
  terms: ["Term 1", "Term 2", "Term 3"],
  scores: [85, 88, 92]
};

export const mockDashboardStats = {
  totalStudents: 150,
  totalTeachers: 15,
  attendance: 92,
  performance: 87,
  notices: [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      content: "Scheduled for next Friday",
      date: new Date().toISOString()
    },
    {
      id: 2,
      title: "Sports Day",
      content: "Annual sports day next month",
      date: new Date().toISOString()
    }
  ]
}; 