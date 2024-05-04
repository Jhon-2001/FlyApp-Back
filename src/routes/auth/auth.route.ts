import express, { Request, NextFunction, Response } from 'express';
import prisma from '../../../prisma/prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../../../types/user.js';

dotenv.config();

export const authRouter = express.Router();

authRouter.get('/me', async (req:Request, res:Response) => {
  try {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader != 'undefined') {
      // Split the header to get the token part
      const bearer = bearerHeader?.split(' ');
      const token = bearer[1];

      // Verify token
      const tokenInfo = jwt.verify(token, process.env.TOKEN_SECRET!, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Failed to authenticate token.' });
        } else {
          const user = decoded && await prisma.user.findFirst({
            where: {
              // id: decoded?.id
            }
          }) || null;

          return res.status(200).json({
            id: user?.id,
            email: user?.email,
            name: user?.name,
            role: user?.role
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json( error || 'Eroare pe server.');
  }
});

authRouter.post('/signup', async (req:Request, res:Response) => {
  console.log("req.cookies",req.headers)
  const { password, email ,name} = req.body;

  try {
    const emailCheck = await prisma.user.findFirst({
      where: {
        email: email
      }
    });
    if (emailCheck) {

      return res.status(401).send({error:'Email already exists'});
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });
      console.log(user)
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

authRouter.post('/signin', async (req:Request, res:Response) => {
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
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email or password incorrect' });
    }
    const tokenData: User = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d'
    });
    return res.status(200).json({ token: token, user: user });
  } catch (error) {
    return res.status(500).json( error || 'Eroare pe server');
  }
});
