import express from "express";
import authRouter from "./controllers/auth";
import { AppDataSource } from "./data-source";

const app = express();
app.use(express.json());

AppDataSource.initialize()
	.then(async () => {
		console.log("Data Source has been initialized!");

		app.use("/auth", authRouter);

		app.listen(3000, () => {
			console.log("Server is running on port 3000");
		});
	})
	.catch((error) => console.log(error));
