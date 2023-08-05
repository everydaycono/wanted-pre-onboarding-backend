import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { validateEmail } from '../utils/validation.js';
import prisma from '../../db/db.js';

export const signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password are required.',
    });
  }
  // email validation
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'email is invalid.',
    });
  }

  // password validation (more than 8 characters)
  if (password.length < 8 || password.length > 20) {
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password are required.',
    });
  }

  // email validation
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'email is invalid.',
    });
  }
  // password validation (more than 8-20 characters)
  if (password.length < 8 || password.length > 20) {
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

    if (!isUserExist) {
      return res.status(404).json({
        message: 'Login failed. Please check your email and password.',
      });
    }

    // compare password
    const isPasswordValid = await argon2.verify(isUserExist.password, password);
    if (!isPasswordValid) {
      return res.status(404).json({
        message: 'Login failed. Please check your email and password.',
      });
    }

    // create JWT TOKEN
    const oneDay = 24 * 60 * 60 * 1000;

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: oneDay,
    });

    return res.status(200).json({
      message: 'User login successfully.',
      token,
    });
  } catch (error) {
    next(error);
  }
};
