import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/Routes";
const app: Application = express();
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});

// app.use('/api/v1/user', userRoutes);
app.use("/api/v1", router);

export default app;
