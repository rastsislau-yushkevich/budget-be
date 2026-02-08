import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "@/lib/errors";
import { assignTokens } from "@/lib/helpers/assign-tokens";

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new UnauthorizedError("No refresh token provided");
  }

  try {
    const verifiedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    const refreshedTokens = assignTokens({
      id: verifiedToken.id as string,
      username: verifiedToken.username,
      email: verifiedToken.email,
    });

    return refreshedTokens;
  } catch (_error) {
    throw new UnauthorizedError("Invalid refresh token");
  }
};
