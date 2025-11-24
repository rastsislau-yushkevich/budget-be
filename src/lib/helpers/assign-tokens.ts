import jwt from "jsonwebtoken";
import { env } from "@/env";

export const assignTokens = ({
	email,
	username,
}: {
	email: string;
	username: string;
}) => {
	const accessToken = jwt.sign({ email, username }, env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign({ email, username }, env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};
