import { Router } from 'express';
import { uploadDocument, createQuiz, getQuizzes } from '../controllers/quizController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../config/multer';

const router = Router();

router.post('/upload', authenticateToken, upload.single('document'), uploadDocument);
router.post('/create', authenticateToken, createQuiz);
router.get('/list', authenticateToken, getQuizzes);

export default router;
