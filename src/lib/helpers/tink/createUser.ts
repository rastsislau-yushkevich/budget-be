import axios from "axios";
import { env } from "@/env";

export const createUser = async ({
	appAccessToken,
	userId,
	market,
	locale,
}: {
	appAccessToken: string;
	userId: string;
	market: string;
	locale: string;
}) => {
	try {
		const res = await axios.post(
			`${env.TINK_BASE_URL}/api/v1/user/create`,
			{
				external_user_id: userId,
				market,
				locale,
			},
			{
				headers: {
					Authorization: `Bearer ${appAccessToken}`,
					"Content-Type": "application/json",
				},
			},
		);
		return { data: res.data, error: null };
	} catch (error) {
		return { data: null, error: error.message };
	}
};
