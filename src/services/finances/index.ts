import { AppDataSource } from "@/data-source";
import { Transaction } from "@/entity/Transaction";
import { InternalServerError } from "@/lib/errors";

const transactionRepository = AppDataSource.getRepository(Transaction);

export const getTransactions = async ({
	userId,
	cursor,
	limit,
}: {
	userId: string;
	cursor?: string;
	limit?: number;
}) => {
	try {
		const pageSize = limit ?? 20;

		const queryBuilder = transactionRepository
			.createQueryBuilder("t")
			.where("t.userId = :userId", { userId })
			.orderBy("t.transactionDate", "DESC")
			.addOrderBy("t.id", "DESC")
			.limit(pageSize + 1);

		if (cursor) {
			queryBuilder.andWhere("t.transactionDate < :cursor", { cursor });
		}

		const transactions = await queryBuilder.getMany();

		const hasNextPage = transactions.length > pageSize;
		if (hasNextPage) {
			transactions.pop();
		}

		const nextCursor = hasNextPage
			? transactions[transactions.length - 1].transactionDate
			: null;

		return {
			transactions: transactions.map((t) => ({
				id: t.id,
				name: t.description,
				category: t.category,
				amount: Number(t.amount),
				date: t.transactionDate,
			})),
			cursor: nextCursor,
		};
	} catch (error) {
		throw new InternalServerError("Failed to fetch transactions");
	}
};

export const getMonthlySpending = async ({
	userId,
	monthIndex,
}: {
	userId: string;
	monthIndex: number;
}) => {
	try {
		const now = new Date();
		const targetDate = new Date(
			now.getFullYear(),
			now.getMonth() - monthIndex,
			1,
		);
		const year = targetDate.getFullYear();
		const month = targetDate.getMonth();

		const startDate = new Date(year, month, 1);
		const endDate = new Date(year, month + 1, 0, 23, 59, 59);

		const transactions = await transactionRepository
			.createQueryBuilder("t")
			.where("t.userId = :userId", { userId })
			.andWhere("t.transactionDate BETWEEN :startDate AND :endDate", {
				startDate,
				endDate,
			})
			.getMany();

		// Group by category
		const categoryMap = new Map<string, number>();
		let totalSpent = 0;

		const categoryColors: Record<string, string> = {
			Food: "#22C55E",
			Housing: "#3B82F6",
			Transport: "#06B6D4",
			Entertainment: "#EC4899",
			Utilities: "#F59E0B",
			Shopping: "#8B5CF6",
			Health: "#EF4444",
			Other: "#6B7280",
		};

		transactions.forEach((t) => {
			const amount = Number(t.amount);
			if (amount < 0) {
				const expenseAmount = Math.abs(amount);
				totalSpent += expenseAmount;
				const current = categoryMap.get(t.category) || 0;
				categoryMap.set(t.category, current + expenseAmount);
			}
		});

		const categories = Array.from(categoryMap.entries()).map(
			([category, amount]) => ({
				category,
				amount,
				percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
				color: categoryColors[category] || categoryColors.Other,
			}),
		);

		const currency = transactions.length > 0 ? transactions[0].currency : "PLN";

		return {
			month,
			year,
			totalSpent,
			currency,
			categories,
			transactions: transactions.map((t) => ({
				id: t.id,
				name: t.description,
				category: t.category,
				amount: Number(t.amount),
				date: t.transactionDate,
				currency: t.currency,
			})),
		};
	} catch (error) {
		throw new InternalServerError("Failed to fetch spending data");
	}
};
