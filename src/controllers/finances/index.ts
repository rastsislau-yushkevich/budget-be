import type { Response } from "express";
import { z } from "zod";
import { getMonthlySpending, getTransactions } from "@/services/finances";
import { syncTransactions } from "@/services/finances/sync";
import type { AuthJwtPayload, AuthRequest } from "@/types/auth";

const getTransactionsQuerySchema = z.object({
	limit: z.coerce.number().int().positive().optional(),
	cursor: z.string().optional(),
});

export const transactions = async (req: AuthRequest, res: Response) => {
	try {
		const userId = (req.user as AuthJwtPayload).id;
		const { data, error } = getTransactionsQuerySchema.safeParse(req.query);

		if (error) {
			return res.status(400).json({ error: error.flatten() });
		}

		const result = await getTransactions({
			userId,
			cursor: data.cursor,
			limit: data.limit,
		});
		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(error.status || 500).json({
			message: error.message || "Failed to fetch transactions",
		});
	}
};

const getSpendingQuerySchema = z.object({
	month: z.coerce.number().int().min(0).optional(),
});

export const spending = async (req: AuthRequest, res: Response) => {
	try {
		const userId = (req.user as AuthJwtPayload).id;
		const { data, error } = getSpendingQuerySchema.safeParse(req.query);

		if (error) {
			return res.status(400).json({ error: error.flatten() });
		}

		const result = await getMonthlySpending({
			userId,
			monthIndex: data.month || 0,
		});
		return res.status(200).json(result);
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
