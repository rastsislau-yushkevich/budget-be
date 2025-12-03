import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { authorize } from "@/lib/helpers/tink/authorize";
import { buildTinkUrl } from "@/lib/helpers/tink/buildTinkUrl";
import { createUser } from "@/lib/helpers/tink/createUser";
import { grantUserAccess } from "@/lib/helpers/tink/grantUserAccess";

const usersRepository = AppDataSource.getRepository(User);

export const connect = async ({ username }: { username: string }) => {
	const { id, locale, market } = await usersRepository.findOneBy({ username });

	if (!id) {
		return { url: null, error: "User not found" };
	}

	const authData = await authorize("user:create");
	const userData = await createUser({
		appAccessToken: authData.data.access_token,
		userId: id,
		market,
		locale,
	});
	const accessCodeData = await grantUserAccess({
		externalUserId: id,
		username,
	});

	if (!userData.data) {
		return { url: null, error: userData.error };
	}

	const tinkUrl = buildTinkUrl({
		userAuthCode: accessCodeData.data.code,
		locale,
		market,
	});

	if (!tinkUrl) {
		return { url: null, error: "Failed to build Tink URL" };
	}

	return { url: tinkUrl, error: null };
};
