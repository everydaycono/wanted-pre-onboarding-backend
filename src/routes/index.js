import express from 'express';

const router = express.Router();
import authRouter from './authRouter.js';
import newsRouter from './newsRouter.js';

router.use('/auth', authRouter);
router.use('/news', newsRouter);

export default router;
