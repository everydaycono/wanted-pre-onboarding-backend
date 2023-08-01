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

    if (!news || news.length === 0) {
      return res.status(404).json({
        message: 'news not found.',
      });
    }

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

export const updateSingleNews = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userEmail = req.userInfo.email;

  if (!title && !content) {
    return res.status(400).json({
      message: 'title or content are required',
    });
  }

  try {
    // find news by id
    const news = await prisma.news.findFirst({
      where: {
        id: Number(id),
      },
    });

    // only news owner can delete
    if (news.authorEmail !== userEmail) {
      return res.status(403).json({
        message: "You don't have permission to delete this post.",
      });
    }
    // only news owner can update
    const updatedNews = await prisma.news.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    });
    return res.status(200).json({
      data: updatedNews,
      message: 'News updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSingleNews = async (req, res, next) => {
  const { id } = req.params;
  const userEmail = req.userInfo.email;

  try {
    // find news by id
    const news = await prisma.news.findFirst({
      where: {
        id: Number(id),
      },
    });

    // only news owner can delete
    if (news.authorEmail !== userEmail) {
      return res.status(403).json({
        message: "You don't have permission to delete this post.",
      });
    }

    return res.status(200).json({
      message: 'News deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
