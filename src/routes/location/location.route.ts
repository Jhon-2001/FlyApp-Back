import express, { Request, NextFunction, Response } from 'express';
import dotenv from 'dotenv';
import prisma from '../../../prisma/prisma-client';

dotenv.config();

export const locationRouter = express.Router();

locationRouter.post('/', async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, city, airport } = req.body;
      const newLocationPoint = await prisma.locationPoint.create({
        data: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          city,
          airport,
        }
      });
      res.status(201).json(newLocationPoint);
    } catch (error) {
      console.error('Error creating location point:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // READ all location points
  locationRouter.get('/', async (req: Request, res: Response) => {
    try {
      const locationPoints = await prisma.locationPoint.findMany();
      res.json(locationPoints);
    } catch (error) {
      console.error('Error fetching location points:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // READ a single location point by ID
  locationRouter.get('/:id', async (req: Request, res: Response) => {
    try {
      const locationPoint = await prisma.locationPoint.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      });
      if (!locationPoint) {
        return res.status(404).json({ error: 'Location point not found' });
      }
      res.json(locationPoint);
    } catch (error) {
      console.error('Error fetching location point:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // UPDATE a location point by ID
  locationRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
      const { latitude, longitude,city, airport } = req.body;
      const updatedLocationPoint = await prisma.locationPoint.update({
        where: {
          id: parseInt(req.params.id)
        },
        data: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          city,
          airport
        }
      });
      res.json(updatedLocationPoint);
    } catch (error) {
      console.error('Error updating location point:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // DELETE a location point by ID
  locationRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deletedLocationPoint = await prisma.locationPoint.delete({
        where: {
          id: parseInt(req.params.id)
        }
      });
      res.json(deletedLocationPoint);
    } catch (error) {
      console.error('Error deleting location point:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
