import type { Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { syncTransactions } from "@/services/finances/sync";
import type { AuthJwtPayload, AuthRequest } from "@/types/auth";
import { exchangeCodeForToken } from "@/lib/helpers/tink/exchangeCodeForToken";

export const callback = async (req: AuthRequest, res: Response) => {
  try {
    const { code, credentialsId } = req.body;

    if (!code || !credentialsId) {
      return res.status(400).json({
        message: "Missing required parameters: code and credentialsId",
      });
    }

    // Store the credentialsId and exchange code for access token
    const userId = (req.user as AuthJwtPayload).id;

    const userRepository = AppDataSource.getRepository(User);

    // Exchange code for access token immediately
    let accessToken: string;
    let tokenExpiry: Date;
    try {
      const tokenData = await exchangeCodeForToken({ code });
      accessToken = tokenData.access_token || tokenData;
      // Tink tokens typically last 1 hour, set expiry to 50 minutes from now to be safe
      tokenExpiry = new Date(Date.now() + 50 * 60 * 1000);
    } catch (error) {
      accessToken = "";
      tokenExpiry = new Date();
    }

    const result = await userRepository.update(
      { id: userId },
      {
        tinkCredentialsId: credentialsId,
        tinkAuthCode: code,
        tinkAccessToken: accessToken,
        tinkAccessTokenExpiry: tokenExpiry,
      },
    );

    // Automatically sync transactions after connecting bank
    try {
      await syncTransactions({ userId });
    } catch (syncError) {
      // Don't fail the callback if sync fails
    }

    return res.status(200).json({
      success: true,
      message: "Tink callback received successfully",
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to process Tink callback",
    });
  }
};
