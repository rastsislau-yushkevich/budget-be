import axios, { AxiosResponse } from "axios";
import { env } from "@/env";
import { InternalServerError } from "@/lib/errors";

export const authorizeUser = async (tinkUserId: string, userId: string, clientAccessToken: string) => {
    const scope = "accounts:read,balances:read,transactions:read,provider-consents:read";
    const authGrantPayload = new URLSearchParams({
        user_id: tinkUserId,
        external_user_id: userId,
        scope,
    });

    let authGrantResponse: AxiosResponse;

    try {
        authGrantResponse = await axios.post(
            `${env.TINK_BASE_URL}/api/v1/oauth/authorization-grant`,
            authGrantPayload,
            {
                headers: {
                    Authorization: `Bearer ${clientAccessToken}`,
                },
            },
        );
    } catch (_error) {
        throw new InternalServerError("Failed to authorize Tink client");
    }

    const userAccessPayload = new URLSearchParams({
        code: authGrantResponse.data.code,
        client_id: env.TINK_CLIENT_ID,
        client_secret: env.TINK_CLIENT_SECRET,
        grant_type: "authorization_code",
    });

    try {
        const userAccessTokenResponse = await axios.post(
            `${env.TINK_BASE_URL}/api/v1/oauth/token`,
            userAccessPayload,
        );
        return userAccessTokenResponse.data;
    } catch (_error) {
        throw new InternalServerError("Failed to authorize Tink client");
    }
}