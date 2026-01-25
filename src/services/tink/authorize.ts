import { authorizeUser } from "@/lib/helpers/tink/authorizeUser";

export const authorize = async () => {

    const authData = await authorizeUser("", "", "");

} 