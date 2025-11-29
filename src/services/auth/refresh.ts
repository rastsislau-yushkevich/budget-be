import jwt, { type JwtPayload } from "jsonwebtoken";
import { assignTokens } from "@/lib/helpers/assign-tokens";

export const refresh = async (refreshToken: string) => {
	const verifiedToken = jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
	) as JwtPayload;

	if (!verifiedToken) {
		throw new Error("Invalid refresh token");
	}

	const refreshedTokens = assignTokens({
		username: verifiedToken.username,
		email: verifiedToken.email,
	});

	return refreshedTokens;
};
