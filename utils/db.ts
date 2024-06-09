import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
let isDbConnected = false;


// Funcție pentru verificarea conexiunii la baza de date
export default function checkDbConnection() {
    if (!isDbConnected) {
      prisma.$connect()
        .then(() => {
          console.log('Database connected successfully.');
          isDbConnected = true;
        })
        .catch((error) => {
          console.error('Unable to connect to the database:', error);
          process.exit(1); // Exit the process if unable to connect
        });
    }
  }