import express, { Request, NextFunction, Response } from 'express';
import prisma from '../../../prisma/prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../../../types/user.js';
import { extractAccessToken } from '../../../utils/extractToken';
dotenv.config();

export const authRouter = express.Router();

// Endpoint pentru obținerea informațiilor utilizatorului curent
authRouter.get('/me', async (req: Request, res: Response) => {
  const cookies = req.headers.cookie;
  const token = extractAccessToken(cookies, 'FLYAccessToken');
  try {
    if (token) {
      // Split the header to get the token part

      // Verify token
      const tokenInfo = jwt.verify(token, process.env.TOKEN_SECRET!, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Failed to authenticate token.' });
        } else {
          const user: any = decoded;
          return res.status(200).json({
            id: user.id,
            email: user?.email,
            role: user?.role,
            name: user?.name
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json(error || 'Eroare pe server.');
  }
});
// Endpoint pentru înregistrarea unui nou utilizator
authRouter.post('/signup', async (req: Request, res: Response) => {
  const { password, email, name } = req.body;

  try {
    const emailCheck = await prisma.user.findFirst({
      where: {
        email: email
      }
    });
    if (emailCheck) {
      return res.status(401).send({ error: 'Email already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
// Endpoint pentru autentificarea utilizatorului
authRouter.post('/signin', async (req: Request, res: Response) => {
  const { password, email } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });
    if (!user) {
      return res.status(401).json({ error: 'Email or password incorrect' });
    }
      // Compararea parolei hash-uite
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email or password incorrect' });
    }
    const tokenData: User = {
      id: user.id,
      email: user.email,
      role: user.role,
      name:user?.name
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d'
    });
    return res.status(200).json({ token: token, user: user });
  } catch (error) {
    return res.status(500).json(error || 'Eroare pe server');
  }
});
