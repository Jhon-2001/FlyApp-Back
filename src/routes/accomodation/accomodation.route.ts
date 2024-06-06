import express from 'express';
import prisma from '../../../prisma/prisma-client';
import e from 'express';

export const accomodationRouter = express.Router();

// Create Accommodation
// Endpoint pentru crearea unei noi intrări de cazare în baza de date
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

    // Crearea unei noi intrări de cazare folosind Prisma
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
        takenDates: {} // Inițializarea takenDates ca un obiect gol
      }
    });

    // Trimiterea cazării create ca răspuns
    res.json(newAccommodation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Read Accommodation
// Endpoint pentru obținerea unei cazări specifice după ID
accomodationRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
      // Obținerea cazării după ID folosind Prisma
    const accommodation = await prisma.accommodation.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        location: true
      }
    });
    res.json(accommodation);
  } catch (error) {
    next(error);
  }
});
// Endpoint pentru obținerea tuturor cazărilor
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
// Endpoint pentru găsirea cazărilor disponibile pe baza criteriilor
accomodationRouter.post('/disponible', async (req, res, next) => {
  const data = req.body;
  console.log(data);
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
        ],
        stars: {
          gte: +data.stars
        }
      }
    });
    res.json(accommodation);
  } catch (error) {
    next(error);
  }
});

// Update Accommodation
// Endpoint pentru actualizarea unei cazări existente după ID
accomodationRouter.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      descriere,
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
        descriere,
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
// Endpoint pentru ștergerea unei cazări după ID
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
