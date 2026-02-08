import axios from "axios";
import { env } from "@/env";
import { InternalServerError } from "@/lib/errors";

export const getTransactions = async ({
  userAccessToken,
  externalUserId,
}: {
  userAccessToken: string;
  externalUserId: string;
}) => {
  try {
    // Tink API v2 endpoint for fetching transactions
    const res = await axios.get(`${env.TINK_BASE_URL}/api/v1/transactions`, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
      params: {
        externalUserId,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new InternalServerError("Failed to fetch transactions from Tink");
  }
};
