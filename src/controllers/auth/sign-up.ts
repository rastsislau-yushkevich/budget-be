import type { Request, Response } from "express";
import { signUp as signUpService } from "@/services/auth";

export const signUp = async (req: Request, res: Response) => {
	const { email, username, password, locale, market } = req.body;

	try {
		const tokens = await signUpService({
			email,
			username,
			password,
			locale,
			market,
		});

		return res
			.status(200)
			.json({ message: "User signed up successfully", tokens });
	} catch (error) {
		return res.status(error.status).json({ message: error.message });
	}
};
