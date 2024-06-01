import express, { Request, NextFunction, Response } from 'express';
import prisma from '../../../prisma/prisma-client';

export const usersRouter = express.Router();

usersRouter.get('/', async (req: Request, res: Response) => {
  console.log('ere')
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
      
    }
  });