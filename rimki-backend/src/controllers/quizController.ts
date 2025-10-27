import { Request, Response } from 'express';
import { documents, quizzes, type Document, type Quiz } from '../config/database';
import path from 'path';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document: Document = {
      id: Date.now().toString(),
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date()
    };

    documents.push(document);

    res.json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        filename: document.originalname,
        size: document.size,
        uploadedAt: document.uploadedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Quiz title is required' });
    }

    const quizId = Date.now().toString();
    const quizLink = `https://rimki-quiz.com/quiz/${quizId}`;

    const quiz: Quiz = {
      id: quizId,
      title: title || 'Security Policy Quiz',
      questions: questions || [],
      createdAt: new Date(),
      link: quizLink
    };

    quizzes.push(quiz);

    res.json({
      message: 'Quiz created successfully',
      quiz: {
        id: quiz.id,
        title: quiz.title,
        link: quiz.link,
        createdAt: quiz.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    res.json({
      quizzes: quizzes.map(q => ({
        id: q.id,
        title: q.title,
        link: q.link,
        createdAt: q.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
