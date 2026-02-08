import axios from "axios";
import { env } from "@/env";
import { InternalServerError } from "@/lib/errors";

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
		return res.data;
	} catch (error: any) {
		throw new InternalServerError(
			error.response?.data?.errorMessage || "Failed to create Tink user",
		);
	}
};
