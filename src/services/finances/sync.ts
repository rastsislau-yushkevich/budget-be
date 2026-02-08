import { AppDataSource } from "@/data-source";
import { Transaction } from "@/entity/Transaction";
import { User } from "@/entity/User";
import { InternalServerError, NotFoundError } from "@/lib/errors";
import { exchangeCodeForToken } from "@/lib/helpers/tink/exchangeCodeForToken";
import { getTransactions } from "@/lib/helpers/tink/getTransactions";

const transactionRepository = AppDataSource.getRepository(Transaction);
const userRepository = AppDataSource.getRepository(User);

// Map Tink categories to our app categories
const mapCategory = (tinkCategoryId?: string, description?: string): string => {
	if (!tinkCategoryId) return "Other";

	// Tink category IDs to app categories mapping
	const categoryMap: Record<string, string> = {
		// Food & Groceries
		b3963cfe6bf54c06b22eaa44a0a6cf3f: "Food",
		c59a38ff206c4fe29a9e7b2bb1fcb3de: "Food",
		"63a7e66150d44c67a3380265c86e1c26": "Food",

		// Housing
		b64f0e4f328a4d00b623b7ca3f588879: "Housing",

		// Transport
		"3aa36e08db054422941fec97d2ab33f6": "Transport",

		// Entertainment
		"167a4ebe333245faa00f10b62493cdbc": "Entertainment",

		// Utilities
		"049ff3909f4d46fc9cb63a4f9b048ece": "Utilities",

		// Health
		"6ddd66c5b7c84bd09c6c68d8b75a4314": "Health",

		// Shopping
		ed909bd383f245aabab53d3e3ee8e4bf: "Shopping",

		// Transfers & Income
		"420e802515a140b1b2b389b54500784f": "Other",
		e6ada2dc635c48e586a3de69591995d7: "Other",
		"5f23014f62cf4cf19ad58f9ac84bbe34": "Other",
		"075fab3ec31f43aa9d39675475c1fb1a": "Other",
	};

	// Check mapped category first
	if (categoryMap[tinkCategoryId]) {
		return categoryMap[tinkCategoryId];
	}

	// Fallback: try to categorize by description keywords
	if (description) {
		const desc = description.toLowerCase();
		if (
			desc.includes("netflix") ||
			desc.includes("spotify") ||
			desc.includes("youtube") ||
			desc.includes("apple") ||
			desc.includes("itunes") ||
			desc.includes("play")
		) {
			return "Entertainment";
		}
		if (
			desc.includes("orlen") ||
			desc.includes("shell") ||
			desc.includes("bp") ||
			desc.includes("gas")
		) {
			return "Transport";
		}
		if (
			desc.includes("pkp") ||
			desc.includes("train") ||
			desc.includes("bus") ||
			desc.includes("metro")
		) {
			return "Transport";
		}
		if (
			desc.includes("amazon") ||
			desc.includes("media markt") ||
			desc.includes("store") ||
			desc.includes("biedronka") ||
			desc.includes("zabka")
		) {
			return "Shopping";
		}
		if (
			desc.includes("pyszne") ||
			desc.includes("restaurant") ||
			desc.includes("cafe") ||
			desc.includes("da grasso")
		) {
			return "Food";
		}
		if (
			desc.includes("orange") ||
			desc.includes("plus") ||
			desc.includes("t-mobile") ||
			desc.includes("telecom") ||
			desc.includes("play mobile")
		) {
			return "Utilities";
		}
		if (
			desc.includes("czyn") ||
			desc.includes("rent") ||
			desc.includes("przelew")
		) {
			return "Housing";
		}
	}

	return "Other";
};

export const syncTransactions = async ({ userId }: { userId: string }) => {
	try {
		const user = await userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundError("User not found");
		}

		if (!user.tinkCredentialsId) {
			throw new Error("User has not connected a bank account");
		}

		// Get user access token - use cached token if not expired, otherwise exchange code
		let accessToken: string;

		if (
			user.tinkAccessToken &&
			user.tinkAccessTokenExpiry &&
			new Date() < user.tinkAccessTokenExpiry
		) {
			accessToken = user.tinkAccessToken;
		} else if (user.tinkAuthCode) {
			const tokenData = await exchangeCodeForToken({ code: user.tinkAuthCode });
			accessToken = tokenData.access_token || tokenData;

			// Cache the new token
			const tokenExpiry = new Date(Date.now() + 50 * 60 * 1000);
			await userRepository.update(
				{ id: userId },
				{
					tinkAccessToken: accessToken,
					tinkAccessTokenExpiry: tokenExpiry,
				},
			);
		} else {
			throw new Error("No valid credentials to fetch transactions");
		}

		const tinkData = await getTransactions({
			userAccessToken: accessToken,
			externalUserId: user.id,
		});

		const transactions = Array.isArray(tinkData)
			? tinkData
			: tinkData.transactions || tinkData.results || [];
		let savedCount = 0;

		for (const tinkTx of transactions) {
			const exists = await transactionRepository.findOne({
				where: { tinkId: tinkTx.id },
			});

			if (exists) continue;

			const transaction = transactionRepository.create({
				userId: user.id,
				description: tinkTx.description || "Transaction",
				amount: tinkTx.amount,
				category: mapCategory(tinkTx.categoryId, tinkTx.description),
				transactionDate: new Date(tinkTx.date || 0),
				tinkId: tinkTx.id,
				credentialsId: user.tinkCredentialsId,
				currency: tinkTx.currencyDenominatedAmount?.currencyCode || "PLN",
			});

			await transactionRepository.save(transaction);
			savedCount++;
		}

		return {
			success: true,
			synced: savedCount,
			total: transactions.length,
		};
	} catch (error: any) {
		throw new InternalServerError(
			error.message || "Failed to sync transactions",
		);
	}
};
