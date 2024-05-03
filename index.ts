import  express, { Request, Response , Application } from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import checkDbConnection from "./utils/db";
import { authRouter } from "./src/routes/auth/auth.route"

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());


app.get("/", (req:Request, res:Response) => {
  res.send("Successful response.");
});

// @@@ROUTES@@@

app.use("/auth" , authRouter)

// @@@ROUTES@@@


checkDbConnection()

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});


