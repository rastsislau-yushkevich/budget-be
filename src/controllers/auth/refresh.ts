import type { Request, Response } from "express";
import { refresh as refreshService } from "@/services/auth";

export const refresh = async (req: Request, res: Response) => {
	const refreshToken = req.headers.authorization.replace("Bearer ", "");
	try {
		const tokens = await refreshService(refreshToken);

		return res
			.status(200)
			.json({ message: "User refreshed successfully", tokens });
	} catch (error) {
		return res.status(error.status).json({ message: error.message });
	}
};
