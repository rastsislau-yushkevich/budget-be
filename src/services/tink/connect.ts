import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { InternalServerError, NotFoundError } from "@/lib/errors";
import { authorize } from "@/lib/helpers/tink/authorize";
import { buildTinkUrl } from "@/lib/helpers/tink/buildTinkUrl";
import { createUser } from "@/lib/helpers/tink/createUser";
import { grantUserAccess } from "@/lib/helpers/tink/grantUserAccess";

const usersRepository = AppDataSource.getRepository(User);

export const connect = async ({ username }: { username: string }) => {
	const { id, locale, market } = await usersRepository.findOneBy({ username });

	if (!id) {
		throw new NotFoundError("User not found");
	}

	const authData = await authorize("user:create");
	await createUser({
		appAccessToken: authData.access_token,
		userId: id,
		market,
		locale,
	});

	const accessCodeData = await grantUserAccess({
		externalUserId: id,
		username,
	});

	const tinkUrl = buildTinkUrl({
		userAuthCode: accessCodeData.code,
		locale,
		market,
	});

	if (!tinkUrl) {
		throw new InternalServerError("Failed to build Tink URL");
	}

	return tinkUrl;
};
