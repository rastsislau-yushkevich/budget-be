import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@Column()
	market: string;

	@Column()
	locale: string;
}
