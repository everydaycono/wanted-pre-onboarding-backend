import 'dotenv/config';

import express from 'express';
import apiRoutes from './routes/index.js';
import { PrismaClient } from '@prisma/client';
import { notFoundRouter } from './routes/not-found.router.js';
import { errorHandler } from './error/error-handler.js';

const app = express();
const PORT =
  app.settings.env === 'development' ? process.env.PORT || 8000 : 8001;

// Create Prisma client instance.
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api', apiRoutes);

// Error handler
app.use(notFoundRouter);
app.use(errorHandler);

const main = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT} now!`)
    );
  } catch (error) {
    console.log(error.message);
    console.log('Server is not running');
    await prisma.$disconnect();
    process.exit();
  }
};

main();

// Signal Interrupt 발생 Prisma 클라이언트 연결을 해제합니다.
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

export default app;
