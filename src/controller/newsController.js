import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const showNews = (req, res) => {
  res.send('SHOW NEWS!');
};

export const createNews = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: 'title and content are required',
    });
  }

  // title, content length check
  if (title.length < 2 || title.length > 100) {
    return res.status(400).json({
      message:
        'title must be at least 2 characters and at most 100 characters.',
    });
  }
  if (content.length < 2 || content.length > 1000) {
    return res.status(400).json({
      message:
        'content must be at least 2 characters and at most 1000 characters.',
    });
  }

  try {
    // create news
    const news = await prisma.news.create({
      data: {
        title,
        content,
        authorEmail: req.userInfo.email,
      },
    });

    return res.status(201).json({
      data: news,
      message: 'News created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const showSingleNews = (req, res) => {
  res.send('Show Single NEWS');
};

export const updateSingleNews = (req, res) => {
  res.send('Update Single NEWS');
};

export const deleteSingleNews = (req, res) => {
  res.send('Delete single NEWS');
};
