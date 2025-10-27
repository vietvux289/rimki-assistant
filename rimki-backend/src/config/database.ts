// In-memory database simulation
export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
}

export interface Document {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  questions: any[];
  createdAt: Date;
  link: string;
}

// In-memory storage
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$rOCfmqI5QRX2XvGw7JN7rO7x7n5K5F8F5X5X5X5X5X5X5X5X5X5X', // password: admin123
    email: 'admin@rimki.com'
  }
];

export const documents: Document[] = [];
export const quizzes: Quiz[] = [];
