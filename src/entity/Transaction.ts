import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, { eager: true })
	user: User;

	@Column()
	userId: string;

	@Column()
	description: string;

	@Column("decimal", { precision: 10, scale: 2 })
	amount: number;

	@Column()
	category: string;

	@Column()
	transactionDate: Date;

	@Column({ nullable: true })
	tinkId: string;

	@Column({ nullable: true })
	credentialsId: string;

	@Column({ default: "PLN" })
	currency: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
