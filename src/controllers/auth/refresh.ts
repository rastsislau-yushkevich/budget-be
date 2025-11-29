import type { Request, Response } from "express";
import { refresh as refreshService } from "@/services/auth";

export const refresh = async (req: Request, res: Response) => {
	const tokens = await refreshService(req.cookies.refreshToken);

	if (!tokens) {
		return res.status(401).json({ message: "Invalid refresh token" });
	}

	return res
		.status(200)
		.json({ message: "User refreshed successfully", tokens });
};
