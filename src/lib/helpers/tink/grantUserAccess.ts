import axios from "axios";
import { env } from "@/env";
import { authorize } from "./authorize";

export const grantUserAccess = async ({
	externalUserId,
	username,
}: {
	externalUserId: string;
	username: string;
}) => {
	try {
		const authData = await authorize("authorization:grant");
		console.log("authData", authData);

		const payload = new URLSearchParams({
			actor_client_id: "df05e4b379934cd09963197cc855bfe9",
			external_user_id: externalUserId,
			id_hint: username,
			scope:
				"authorization:read,authorization:grant,credentials:refresh,credentials:read,credentials:write,providers:read,user:read",
		});
		console.log("payload", payload.toString());
		console.log(
			`${env.TINK_BASE_URL}/api/v1/oauth/authorization-grant/delegate`,
		);

		const res = await axios.post(
			`${env.TINK_BASE_URL}/api/v1/oauth/authorization-grant/delegate`,
			payload.toString(),
			{
				headers: {
					Authorization: `Bearer ${authData.data.access_token}`,
				},
			},
		);

		return { data: res.data, error: null };
	} catch (error) {
		return { data: null, error: error.data };
	}
};
