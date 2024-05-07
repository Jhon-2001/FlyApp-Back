import express, { Request, NextFunction, Response } from 'express';
import prisma from '../../../prisma/prisma-client';
import { Flight } from '../../../types/flight';

export const flyghtRouter = express.Router();

flyghtRouter.post('/', async (req: Request, res: Response) => {
  try {
    const flightData: Flight = req.body;
    const newFlight = await prisma.flight.create({ data: flightData });
    res.status(201).json(newFlight);
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ all flights
flyghtRouter.get('/', async (req: Request, res: Response) => {
  try {
    const flights = await prisma.flight.findMany();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ a single flight by ID
flyghtRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flight = await prisma.flight.findUnique({ where: { id: parseInt(id) } });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE a flight by ID
flyghtRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flightData: Flight = req.body;
    const updatedFlight = await prisma.flight.update({
      where: { id: parseInt(id) },
      data: flightData
    });
    res.json(updatedFlight);
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a flight by ID
flyghtRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.flight.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
