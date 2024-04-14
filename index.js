import express, { json } from "express";

const app = express();
const port = process.env.PORT || 8000;

// app.use(cors());

app.get("/", (req, res) => {
  res.send("Successful response.");
});
app.use(json());
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
