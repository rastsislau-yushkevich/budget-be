import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Transaction } from "./entity/Transaction";

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
