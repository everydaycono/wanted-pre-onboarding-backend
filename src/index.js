import { PrismaClient } from '@prisma/client';
import express from 'express';
import apiRoutes from './routes/index.js';
import { notFoundRouter } from './routes/not-found.router.js';
import { errorHandler } from './error/error-handler.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Create Prisma client instance.
const prisma = new PrismaClient();

app.use(express.json());

app.use('/api', apiRoutes);

// Error handler
app.use(notFoundRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT} now!`));

// Signal Interrupt 발생 Prisma 클라이언트 연결을 해제합니다.
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
