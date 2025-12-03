import * as bcrypt from "bcrypt";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { assignTokens } from "@/lib/helpers/assign-tokens";

const usersRepo = AppDataSource.getRepository(User);

export const signIn = async ({
	username,
	password,
}: Pick<User, "username" | "password">) => {
	const user = await usersRepo.findOneBy({ username });

	if (!user) {
		throw new Error("User not found");
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		throw new Error("Invalid password");
	}

	const tokens = assignTokens({ email: user.email, username: user.username });

	await usersRepo.update(user.id, { refreshToken: tokens.refreshToken });

	return tokens;
};
