import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { authRouter } from './src/routes/auth/auth.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Successful response.");
});

// @@@ROUTES@@@

app.use("/auth" , authRouter)




app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});


