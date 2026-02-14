import type { Response } from "express";
import { disconnect } from "@/services/tink/disconnect";
import type { AuthJwtPayload, AuthRequest } from "@/types/auth";

export const disconnectController = async (req: AuthRequest, res: Response) => {
	try {
		const userId = (req.user as AuthJwtPayload).id;
		const result = await disconnect({ userId });
		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(error.status || 500).json({
			message: error.message || "Failed to disconnect bank",
		});
	}
};
