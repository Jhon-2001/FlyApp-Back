import express, { Request, Response } from 'express';
import prisma from '../../../prisma/prisma-client';

export const flyghtRouter = express.Router();

flyghtRouter.post('/', async (req: Request, res: Response) => {
  try {
    const flightData = req.body;
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
    const flights = await prisma.flight.findMany({
      include: {
        locationStartFlight: true,
        locationEndFlight: true
      }
    });

    const formattedFlights = flights.map((flight) => ({
      ...flight,
      startLocation: flight.locationStartFlight,
      endLocation: flight.locationEndFlight
    }));

    res.json(formattedFlights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

flyghtRouter.get('/admin', async (req: Request, res: Response) => {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        locationStartFlight: true,
        locationEndFlight: true
      }
    });

    const formattedFlights = flights.map((flight) => ({
      ...flight,
      startLocation: flight.locationStartFlight,
      endLocation: flight.locationEndFlight
    }));
    const accommodation = await prisma.accommodation.findMany({
      include: { location: true }
    });

    const books = await prisma.userAccomodationFlight.findMany({
      include: { Flight: true, Accomodation: true }
    });
    res.json({ formattedFlights, accommodation, books });
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

flyghtRouter.post('/disponible', async (req: Request, res: Response) => {
  try {
    const { from, to, depart, number, class: flightClass, return: returnDate } = req.body;
    console.log(number);
    const departDate = new Date(depart);
    const nextDay = new Date(departDate);
    nextDay.setDate(departDate.getDate() + 2);
    const backDay = new Date(departDate);
    backDay.setDate(departDate.getDate() - 2);

    console.log('returnDate', returnDate);

    const returnDateObject = returnDate ? new Date(returnDate) : null;
    let nextDayReturn, previousDayReturn;
    if (returnDateObject) {
      nextDayReturn = new Date(returnDateObject);
      nextDayReturn.setDate(returnDateObject.getDate() + 3);
      previousDayReturn = new Date(returnDateObject);
      previousDayReturn.setDate(returnDateObject.getDate() - 1);
    }
    console.log(previousDayReturn, '<>', nextDayReturn);
    const filters: any = {
      locationStartFlight: {
        city: {
          contains: from.toLowerCase(),
          mode: 'insensitive'
        }
      },
      locationEndFlight: {
        city: {
          contains: to.toLowerCase(),
          mode: 'insensitive'
        }
      },
      startDate: {
        gte: backDay,
        lte: nextDay
      },
      numberOfPeople: {
        gte: number
      }
    };

    const filtersReturn: any = {
      locationStartFlight: {
        city: {
          contains: from.toLowerCase(),
          mode: 'insensitive'
        }
      },
      locationEndFlight: {
        city: {
          contains: to.toLowerCase(),
          mode: 'insensitive'
        }
      },
      endDate: {
        gte: previousDayReturn,
        lte: nextDayReturn
      },
      numberOfPeople: {
        gte: number
      }
    };
    const flights = await prisma.flight.findMany({
      where: filters,
      include: {
        locationStartFlight: true,
        locationEndFlight: true
      }
    });

    console.log('flights', flights);

    if (returnDate) {
    }
    const flights2 = await prisma.flight.findMany(
      {
        where: filtersReturn,
        include: {
          locationStartFlight: true,
          locationEndFlight: true
        }
      } || []
    );
    console.log('flights2', flights2);

    const formattedFlights = flights.map((flight) => ({
      ...flight,
      flightClass: flightClass,
      startLocation: flight.locationStartFlight,
      endLocation: flight.locationEndFlight
    }));
    const formattedFlights2 = flights2.map((flight) => ({
      ...flight,
      flightClass: flightClass,
      startLocation: flight.locationStartFlight,
      endLocation: flight.locationEndFlight
    }));
    const allFormattedFlights = returnDate
      ? [...formattedFlights, ...formattedFlights2]
      : formattedFlights;

    res.json(allFormattedFlights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ a single flight by ID
flyghtRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flight = await prisma.flight.findUnique({
      where: { id: parseInt(id) },
      include: {
        locationStartFlight: true,
        locationEndFlight: true
      }
    });
    const formattedFlights = {
      ...flight,
      startLocation: flight?.locationStartFlight,
      endLocation: flight?.locationEndFlight
    };
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(formattedFlights);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE a flight by ID
flyghtRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flightData = req.body;
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
