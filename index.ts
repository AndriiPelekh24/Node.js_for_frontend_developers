import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import userRouter from "./src/routes/user.route";
import exerciseRouter from "./src/routes/exercise.route";
import { BASE_URL } from "./src/interfaces/interfaces";


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(BASE_URL, userRouter);
app.use(BASE_URL, exerciseRouter);
app.use(cors());
app.use(express.static("public"));

app.get("/", (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

const PORT: number = Number(process.env.PORT) || 3000;
const listener = app.listen(PORT, () => {
  const address = listener.address();
  const port = address && typeof address === "object" ? address["port"] : PORT;
  console.log(`Your app is listening on port ${port}`);
});
