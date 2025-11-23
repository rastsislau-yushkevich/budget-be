import type { Request, Response } from "express";
import { signUp as signUpService } from "@/services/auth";

export const signUp = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	if (!email || !username || !password) {
		return res
			.status(400)
			.json({ message: "Email, username and password are required" });
	}

	const user = await signUpService({ email, username, password });

	if (!user) {
		return res.status(400).json({ message: "Incorrect sign-up data" });
	}

	return res.status(200).json({ message: "User signed up successfully", user });
};
