import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import type { AuthJwtPayload, AuthRequest } from "@/types/auth";

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const decoded = jwt.verify(
			token,
			env.ACCESS_TOKEN_SECRET,
		) as AuthJwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized", error: error.data });
	}
};
