import { Request, Response } from 'express';
import { documents, quizzes, type Document, type Quiz } from '../config/database';
import path from 'path';
import axios from 'axios';
import { google } from 'googleapis';

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
    const { title, language = 'vi' } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Quiz title is required' });
    }

    // Fetch quiz data from external API
    let quizData;
    try {
      const response = await axios.get('http://10.1.24.54/api/quiz-data', {
        timeout: 10000,
        params: { language }
      });
      quizData = response.data;
    } catch (error) {
      console.error('Failed to fetch quiz data from external API:', error);
      // Fallback to default questions if external API fails
      quizData = {
        questions: [
          {
            question: language === 'vi' ? 'Câu hỏi mẫu về bảo mật' : 
                      language === 'ja' ? 'セキュリティに関するサンプル質問' : 
                      'Sample security question',
            options: language === 'vi' ? ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'] :
                     language === 'ja' ? ['選択肢A', '選択肢B', '選択肢C', '選択肢D'] :
                     ['Option A', 'Option B', 'Option C', 'Option D'],
            correct: 0
          }
        ]
      };
    }

    // Create Google Form using Google Forms API
    let googleFormLink = '';
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './service-account-key.json',
        scopes: ['https://www.googleapis.com/auth/forms.body']
      });

      const forms = google.forms({ version: 'v1', auth });
      
      const formRequest = {
        requestBody: {
          info: {
            title: title,
            description: language === 'vi' ? 'Bài quiz về bảo mật' :
                        language === 'ja' ? 'セキュリティクイズ' :
                        'Security Quiz'
          },
          items: quizData.questions.map((q: any, index: number) => ({
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: q.options.map((option: string) => ({ value: option })),
                  shuffle: false
                }
              }
            },
            title: `Question ${index + 1}: ${q.question}`
          }))
        }
      };

      const form = await forms.forms.create(formRequest);
      googleFormLink = `https://docs.google.com/forms/d/${form.data.formId}/edit`;
      
    } catch (error) {
      console.error('Failed to create Google Form:', error);
      // Fallback to local quiz creation
      const quizId = Date.now().toString();
      googleFormLink = `https://rimki-quiz.com/quiz/${quizId}`;
    }

    const quizId = Date.now().toString();
    const quiz: Quiz = {
      id: quizId,
      title: title || 'Security Policy Quiz',
      questions: quizData.questions || [],
      createdAt: new Date(),
      link: googleFormLink,
      language: language
    };

    quizzes.push(quiz);

    res.json({
      message: 'Quiz created successfully',
      quiz: {
        id: quiz.id,
        title: quiz.title,
        link: quiz.link,
        createdAt: quiz.createdAt,
        language: quiz.language
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
