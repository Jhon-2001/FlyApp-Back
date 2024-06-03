import express, { Request, Response, NextFunction } from 'express';
import prisma from '../../../prisma/prisma-client';

export const userAcomodationFlights = express.Router();

// Create a new booked flight
userAcomodationFlights.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, flightId, accommodationId, numberOfPeople, amount } = req.body;
    const newBookedFlight = await prisma.userAccomodationFlight.create({
      data: {
        userId,
        flightId,
        accommodationId,
        numberOfPeople,
        amount
      }
    });
    if (flightId) {
      // Update the number of people in the flight
      await prisma.flight.update({
        where: { id: flightId },
        data: {
          numberOfPeople: {
            increment: numberOfPeople,
          },
        },
      });
    }

    // Check if it's an accommodation booking
    // if (accommodationId) {
    //   // Update the number of people in the accommodation
    //   await prisma.accommodation.update({
    //     where: { id: accommodationId },
    //     data: {
    //       numberOfPeople: {
    //         increment: numberOfPeople,
    //       },
    //     },
    //   });
    // }

    res.status(201).json(newBookedFlight);
  } catch (error) {
    next(error);
  }
});

// Get all booked flights
userAcomodationFlights.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookedFlights = await prisma.userAccomodationFlight.findMany();
    res.status(200).json(bookedFlights);
  } catch (error) {
    next(error);
  }
});

// Get a single booked flight by ID
userAcomodationFlights.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const bookedFlights = await prisma.userAccomodationFlight.findMany({
      where: { userId: Number(id) },
      include: {
        Flight: {
          include: {
            locationStartFlight: true,
            locationEndFlight: true
          }
        },
        Accomodation: {
          include: {
            location: true,
            
          }
        }
      }
    });

    if (bookedFlights.length === 0) {
      return res.status(404).json({ error: 'No booked flights found for this user' });
    }
    res.status(200).json(bookedFlights);
  } catch (error) {
    next(error);
  }
});

// Update a booked flight by ID
userAcomodationFlights.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId, flightId, accommodationId, numberOfPeople, amount } = req.body;
    const updatedBookedFlight = await prisma.userAccomodationFlight.update({
      where: { id: Number(id) },
      data: {
        userId,
        flightId,
        accommodationId,
        numberOfPeople,
        amount
      }
    });
    res.status(200).json(updatedBookedFlight);
  } catch (error) {
    next(error);
  }
});

// Delete a booked flight by ID
userAcomodationFlights.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.userAccomodationFlight.delete({
      where: { id: Number(id) }
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
