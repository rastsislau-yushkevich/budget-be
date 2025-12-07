import type { Response } from "express";
import { connect as connectService } from "@/services/tink/connect";
import type { AuthJwtPayload, AuthRequest } from "@/types/auth";

export const connect = async (req: AuthRequest, res: Response) => {
	try {
		const tinkLink = await connectService({
			username: (req.user as AuthJwtPayload).username,
		});
		return res.status(200).json(tinkLink);
	} catch (error) {
		return res.status(error.status).json({ message: error.message });
	}
};
