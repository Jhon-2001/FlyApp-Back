import express, { Request, Response, NextFunction } from 'express';
import prisma from '../../../prisma/prisma-client';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

export const userAcomodationFlights = express.Router();

const FLY_EMAIL_KEY = "mlsn.eec8ab8b21c728100878e7ea69e34f516d87358874bc2807a961cfc63b101c72"

const accomodationRouter = express.Router();
const mailerSend = new MailerSend({ apiKey: FLY_EMAIL_KEY! });
const sentFrom = new Sender('FlyApp@trial-jy7zpl9xvzpl5vx6.mlsender.net', 'Numele tău');

const trimiteEmail = async (destinatari: any[], subiect: string, continut: string) => {
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(destinatari)
    .setReplyTo(sentFrom)
    .setSubject(subiect)
    .setHtml(continut)
    .setText(continut);
  await mailerSend.email.send(emailParams);
};

const notificaAdmin = async (subiect: string, continut: string) => {
  const destinatari = [new Recipient('admin@yourdomain.com', 'Admin')];
  await trimiteEmail(destinatari, subiect, continut);
};
// Create a new booked flight
userAcomodationFlights.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, flightId, accommodationId, numberOfPeople, amount, checkIn, checkOut } =
      req.body;
    console.log(accommodationId, checkIn, checkOut);
    // Convert check-in and check-out dates to Date objects to handle comparisons
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (accommodationId) {
      // Check if the accommodation is available
      const notAvailable = await prisma.userAccomodationFlight.findFirst({
        where: {
          accommodationId: accommodationId,
          OR: [
            {
              checkIn: {
                lte: checkOutDate // Check if there's a booking with check-in date before the desired check-out date
              },
              checkOut: {
                gte: checkInDate // Check if there's a booking with check-out date after the desired check-in date
              }
            }
          ]
        }
      });
      if (notAvailable) {
        return res.status(409).json({ error: 'Data cazare indisponibilă' });
      }

      // If a conflicting booking is found, respond with an error
    }

    const newBookedFlight = accommodationId
      ? await prisma.userAccomodationFlight.create({
          data: {
            userId,
            flightId,
            accommodationId,
            numberOfPeople,
            amount,
            checkIn: checkInDate || null,
            checkOut: checkOutDate || null
          }
        })
      : await prisma.userAccomodationFlight.create({
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
            increment: numberOfPeople
          }
        }
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    if (user?.email) {
      const email = await trimiteEmail(
        [new Recipient(user.email, user.name!)],
        'Rezervare realizata cu succes',
        `Rezervarea cu id ${newBookedFlight.id} a fost rezlizata cu succes, pentru mai multe detalii consultați profilul dumneavoastra din aplicație.`
      );
      console.log(user?.email, email, 'email');
    }
    res.status(201).json({ newBookedFlight });
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
            location: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (bookedFlights.length === 0) {
      return res.status(404).json({ error: 'Nu exista cazari sau zboruri pentru acest user' });
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
    const { userId, flightId, accommodationId, numberOfPeople, amount, checkIn, checkOut } =
      req.body;

    // Convert check-in and check-out dates to Date objects to handle comparisons
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const updatedBookedFlight = await prisma.userAccomodationFlight.update({
      where: { id: Number(id) },
      data: {
        userId,
        flightId,
        accommodationId,
        numberOfPeople,
        amount,
        checkIn: checkInDate,
        checkOut: checkOutDate
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
    const accommodation = await prisma.userAccomodationFlight.delete({
      where: { id: Number(id) }
    });
    const userId = accommodation.userId;
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    const email = await trimiteEmail(
      [new Recipient(user!.email, user!.name!)],
      'Rezervare a fost anulata',
      `Rezervarea cu id ${id} a fost anulata cu succes, pentru mai multe detalii consultați profilul dumneavoastra din aplicație.`
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
userAcomodationFlights.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});
