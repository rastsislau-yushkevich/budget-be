import type { Response } from "express";
import type { AuthRequest } from "@/types/auth";

export const callback = async (req: AuthRequest, res: Response) => {
  try {
    const { code, credentialsId } = req.body;

    if (!code || !credentialsId) {
      return res.status(400).json({
        message: "Missing required parameters: code and credentialsId",
      });
    }

    // TODO: Store credentials or perform additional processing
    // For now, just acknowledge the callback was received
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
