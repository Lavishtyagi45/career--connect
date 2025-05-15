import express from 'express';
import {
  getQuestionsByDomain,
  getQuestionById,
  submitCode,
  getUserSubmissions
} from '../controllers/practice.controller.js';

const router = express.Router();

// GET all questions by domain
router.get('/questions', getQuestionsByDomain);

// GET single question by ID
router.get('/questions/:id', getQuestionById);

// POST submit code for evaluation
router.post('/submit/:id', submitCode);

router.get('/submissions',getUserSubmissions);

export default router;
