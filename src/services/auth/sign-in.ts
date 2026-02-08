import * as bcrypt from "bcrypt";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { UnauthorizedError } from "@/lib/errors";
import { assignTokens } from "@/lib/helpers/assign-tokens";

const usersRepo = AppDataSource.getRepository(User);

export const signIn = async ({
  username,
  password,
}: Pick<User, "username" | "password">) => {
  const user = await usersRepo.findOneBy({ username });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid password");
  }

  const tokens = assignTokens({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return tokens;
};
