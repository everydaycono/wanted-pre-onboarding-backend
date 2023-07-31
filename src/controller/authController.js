import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
const prisma = new PrismaClient();
export const signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password are required.',
    });
  }
  // email validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'email is invalid.',
    });
  }

  // password validation (more than 8 characters)
  if (password.length < 8) {
    return res.status(400).json({
      message: 'password must be at least 8 characters.',
    });
  }

  try {
    // find if user already exists with provided email
    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (isUserExist) {
      return res.status(409).json({
        message: 'User already exists.',
      });
    }

    // hashpassword
    const hashPassword = await argon2.hash(password);
    // create new user
    await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });
    return res.status(201).json({
      message: 'User created account successfully.',
    });
  } catch (error) {
    next(error);
  }
};
export const signin = (req, res) => {
  res.send('user signin!');
};
