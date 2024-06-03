import express from 'express';
import prisma from '../../../prisma/prisma-client';
import e from 'express';

export const accomodationRouter = express.Router();

// Create Accommodation
accomodationRouter.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      facilities,
      rating,
      stars,
      rooms,
      surface,
      price,
      descriere,
      photos,
      locationId
    } = req.body;
    const newAccommodation = await prisma.accommodation.create({
      data: {
        name,
        description,
        facilities,
        rating,
        stars,
        rooms,
        surface,
        price,
        photos,
        locationId,
        descriere,
        takenDates: {}
      }
    });
    res.json(newAccommodation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Read Accommodation
accomodationRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const accommodation = await prisma.accommodation.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    res.json(accommodation);
  } catch (error) {
    next(error);
  }
});
accomodationRouter.get('/', async (req, res, next) => {
  try {
    const accommodation = await prisma.accommodation.findMany({
      include: { location: true }
    });
    res.json(accommodation);
  } catch (error) {
    next(error);
  }
});
accomodationRouter.post('/disponible', async (req, res, next) => {
  const data = req.body;
  try {
    const accommodation = await prisma.accommodation.findMany({
      include: { location: true },
      where: {
        OR: [
          {
            location: {
              city: {
                contains: data.city.toLowerCase(),
                mode: 'insensitive'
              }
            }
          },
          {
            name: {
              contains: data.city.toLowerCase(),
              mode: 'insensitive'
            }
          }
        ]
      }
    });
    res.json(accommodation);
  } catch (error) {
    next(error);
  }
});

// Update Accommodation
accomodationRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      facilities,
      rating,
      stars,
      rooms,
      surface,
      price,
      photos,
      locationId
    } = req.body;
    const updatedAccommodation = await prisma.accommodation.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        description,
        facilities,
        rating,
        stars,
        rooms,
        surface,
        price,
        photos,
        locationId
      }
    });
    res.json(updatedAccommodation);
  } catch (error) {
    next(error);
  }
});

// Delete Accommodation
accomodationRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.accommodation.delete({
      where: {
        id: parseInt(id)
      }
    });
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    next(error);
  }
});
