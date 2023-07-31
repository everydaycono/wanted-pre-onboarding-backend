import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
  console.log(err.code, ': code');
  console.log(err.name, ': name');
  console.log(err.message, ': message');

  //   Prisma error handle
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: err.message,
      code: err.code,
      name: err.name,
    });
  }

  let customError = {
    statusCode: err.code || err.response.status || 500,
    message: err.message || 'something went wrong',
    name: err.name || 'Error',
  };

  if (err.name === 'Error') {
    customError.message = err.message;
  }
  if (err.name === 'SyntaxError') {
    customError.message = err.message;
  }
  return res.status(customError.statusCode).json({
    message: customError.message,
    name: customError.name,
  });
};
