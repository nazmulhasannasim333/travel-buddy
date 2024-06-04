import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/Routes";
import globalErrorHandler from "./app/middleWare/globalErrorHandler";
import { notFound } from "./app/middleWare/notFound";
const app: Application = express();

//parser
app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://travel-buddy-frontends.vercel.app",
    credentials: true,
  })
);

app.use(globalErrorHandler);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Travel Buddy server is running...",
  });
});

app.use("/api", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
