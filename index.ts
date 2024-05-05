import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkDbConnection from './utils/db';
import { authRouter } from './src/routes/auth/auth.route';
import { flyghtRouter } from './src/routes/flight/flight.route';
import { locationRouter } from './src/routes/location/location.route';
import { accomodationRouter } from './src/routes/accomodation/accomodation.route';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
// app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Successful response.');
});
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3001', 'http://localhost:3000']
  })
);

// @@@ROUTES@@@

app.use('/auth', authRouter);
app.use('/flight', flyghtRouter);
app.use('/location', locationRouter);
app.use('/accomodation', accomodationRouter);


// @@@ROUTES@@@

checkDbConnection();

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
