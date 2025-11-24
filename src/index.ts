import express from "express";
import authRouter from "./controllers/auth";
import { AppDataSource } from "./data-source";
import { env } from "./env";

const app = express();
app.use(express.json());

AppDataSource.initialize()
	.then(async () => {
		console.log("Data Source has been initialized!");

		app.use("/auth", authRouter);

		app.listen(env.PORT, () => {
			console.log(`Server is running on port ${env.PORT}`);
		});
	})
	.catch((error) => console.log(error));
