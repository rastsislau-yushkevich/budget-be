import type { Response } from "express";
import { getMonthlySpending, getTransactions } from "@/services/finances";
import { syncTransactions } from "@/services/finances/sync";
import type { AuthJwtPayload, AuthRequest } from "@/types/auth";

export const transactions = async (req: AuthRequest, res: Response) => {
	try {
		const userId = (req.user as AuthJwtPayload).id;
		const monthIndex = parseInt(req.query.month as string) || 0;

		const data = await getTransactions({ userId, monthIndex });
		return res.status(200).json(data);
	} catch (error: any) {
		return res.status(error.status || 500).json({
			message: error.message || "Failed to fetch transactions",
		});
	}
};

export const spending = async (req: AuthRequest, res: Response) => {
	try {
		const userId = (req.user as AuthJwtPayload).id;
		const monthIndex = parseInt(req.query.month as string) || 0;

		const data = await getMonthlySpending({ userId, monthIndex });
		return res.status(200).json(data);
	} catch (error: any) {
		return res.status(error.status || 500).json({
			message: error.message || "Failed to fetch spending data",
		});
	}
};

export const sync = async (req: AuthRequest, res: Response) => {
	try {
		const userId = (req.user as AuthJwtPayload).id;
		const result = await syncTransactions({ userId });
		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(error.status || 500).json({
			message: error.message || "Failed to sync transactions",
		});
	}
};
