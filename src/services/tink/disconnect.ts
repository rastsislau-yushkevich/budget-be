import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { NotFoundError } from "@/lib/errors";

const usersRepository = AppDataSource.getRepository(User);

export const disconnect = async ({ userId }: { userId: string }) => {
	const user = await usersRepository.findOneBy({ id: userId });

	if (!user) {
		throw new NotFoundError("User not found");
	}

	user.tinkCredentialsId = null;
	user.tinkAuthCode = null;
	user.tinkAccessToken = null;
	user.tinkAccessTokenExpiry = null;

	await usersRepository.save(user);

	return { success: true };
};
