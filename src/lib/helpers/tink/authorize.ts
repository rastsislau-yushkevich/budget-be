import axios from "axios";
import { env } from "@/env";

export const authorize = async (scope: string) => {
	const data = new URLSearchParams();
	data.append("grant_type", "client_credentials");
	data.append("scope", scope);
	data.append("client_id", env.TINK_CLIENT_ID);
	data.append("client_secret", env.TINK_CLIENT_SECRET);
	try {
		const res = await axios.post(
			`${env.TINK_BASE_URL}/api/v1/oauth/token`,
			data,
		);
		return { data: res.data, error: null };
	} catch (error) {
		return { data: null, error: error.message };
	}
};
