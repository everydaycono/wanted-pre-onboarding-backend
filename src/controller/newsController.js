import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const showNews = async (req, res, next) => {
  const { query } = req;
  let paginationOptions = {
    page: query?.page <= 0 ? 0 : query.page || 0,
    limit: query?.limit || 10,
    orederBy: query?.oreder || 'asc',
  };
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      skip: paginationOptions.page * paginationOptions.limit,
      take: paginationOptions.limit,
      select: {
        content: true,
        id: true,
        title: true,
        createdAt: true,
        authorEmail: true,
      },
    });

    const totalCount = await prisma.news.count();

    return res.status(200).json({
      data: news,
      count: news.length,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
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

export const showSingleNews = async (req, res, next) => {
  const { id } = req.params;

  try {
    // find news by id
    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!news) {
      return res.status(404).json({
        message: 'News not found',
      });
    }

    return res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const updateSingleNews = (req, res) => {
  res.send('Update Single NEWS');
};

export const deleteSingleNews = (req, res) => {
  res.send('Delete single NEWS');
};
