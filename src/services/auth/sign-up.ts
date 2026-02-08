import bcrypt from "bcrypt";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { BadRequestError } from "@/lib/errors";
import { assignTokens } from "@/lib/helpers/assign-tokens";

const userRepo = AppDataSource.getRepository(User);

export const signUp = async ({
	email,
	username,
	password,
	locale,
	market,
}: Pick<User, "email" | "username" | "password" | "locale" | "market">) => {
	const userByUsername = await userRepo.findOneBy({ username: username });
	const userByEmail = await userRepo.findOneBy({ email: email });

	if (userByUsername) {
		throw new BadRequestError("User with this username already exists");
	}

	if (userByEmail) {
		throw new BadRequestError("User with this email already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = userRepo.create({
		email,
		username,
		password: hashedPassword,
		locale,
		market,
	});

	const savedUser = await userRepo.save({
		...newUser,
	});

	const tokens = assignTokens({
		id: savedUser.id,
		email: savedUser.email,
		username: savedUser.username,
	});

	delete savedUser.password;

	return tokens;
};
