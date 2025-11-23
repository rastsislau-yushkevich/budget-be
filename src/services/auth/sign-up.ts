import bcrypt from "bcrypt";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";

const userRepo = AppDataSource.getRepository(User);

export const signUp = async ({
	email,
	username,
	password,
}: Pick<User, "email" | "username" | "password">) => {
	const userByUsername = await userRepo.findOneBy({ username: username });
	const userByEmail = await userRepo.findOneBy({ email: email });

	if (userByUsername) {
		throw new Error("User with this username already exists");
	}

	if (userByEmail) {
		throw new Error("User with this email already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = userRepo.create({
		email,
		username,
		password: hashedPassword,
	});

	const savedUser = await userRepo.save(newUser);

	delete savedUser.password;

	return savedUser;
};
