import { authorize } from "@/lib/helpers/tink/authorize";
import { grantUserAccess } from "@/lib/helpers/tink/grantUserAccess";
import { buildTinkUrl } from "@/lib/helpers/tink/buildTinkUrl";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";

const usersRepository = AppDataSource.getRepository(User);

export const connect = async ({ username }: { username: string }) => {
    const { id, locale, market } = await usersRepository.findOneBy({ username });

    if (!id) {
        return { url: null, error: "User not found" };
    }

    const authData = await authorize();
    const userData = await grantUserAccess({ appAccessToken: authData.data.access_token, userId: id, market, locale });

    if (!userData.data) {
        return { url: null, error: userData.error };
    }

    const tinkUrl = buildTinkUrl({ userAuthCode: userData.data.authorization_code, locale, market });

    if (!tinkUrl) {
        return { url: null, error: "Failed to build Tink URL" };
    }

    return { url: tinkUrl, error: null };
};
