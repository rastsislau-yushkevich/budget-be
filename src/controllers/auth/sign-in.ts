import type { Request, Response } from "express";
import { signIn as signInService } from "@/services/auth";

export const signIn = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}

	const tokens = await signInService({ username, password });

	return res
		.status(200)
		.json({ message: "User signed in successfully", tokens });
};
