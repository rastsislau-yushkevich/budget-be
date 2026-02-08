import axios from "axios";
import { env } from "@/env";
import { InternalServerError } from "@/lib/errors";

export const exchangeCodeForToken = async ({ code }: { code: string }) => {
	try {
		const res = await axios.post(
			`${env.TINK_BASE_URL}/api/v1/oauth/token`,
			new URLSearchParams({
				code,
				client_id: env.TINK_CLIENT_ID,
				client_secret: env.TINK_CLIENT_SECRET,
				grant_type: "authorization_code",
			}),
		);
		return res.data;
	} catch (error: any) {
		throw new InternalServerError("Failed to exchange code for token");
	}
};
