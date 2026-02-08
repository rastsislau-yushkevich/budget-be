import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./controllers/auth";
import tinkRouter from "./controllers/tink";
import { AppDataSource } from "./data-source";
import { env } from "./env";

const app = express();
app.use(express.json());
app.use(cookieParser());

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    app.use("/auth", authRouter);
    app.use("/api/tink", tinkRouter);

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
