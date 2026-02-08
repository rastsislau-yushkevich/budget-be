import "reflect-metadata";
import { DataSource } from "typeorm";
import { Transaction } from "./entity/Transaction";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "123",
	database: "budget",
	synchronize: true,
	logging: false,
	entities: [User, Transaction],
	migrations: [],
	subscribers: [],
});
