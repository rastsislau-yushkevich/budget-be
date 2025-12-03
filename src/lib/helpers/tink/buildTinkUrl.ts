import { env } from "@/env";

export const buildTinkUrl = ({
	userAuthCode,
	locale,
	market,
}: {
	userAuthCode: string;
	locale: string;
	market: string;
}) => {
	//TODO: change state to a desired value
	return `${env.TINK_LINK_BASE_URL}/1.0/transactions/connect-accounts?client_id=${env.TINK_CLIENT_ID}&state=${true}&redirect_uri=${env.REDIRECT_URI}&authorization_code=${userAuthCode}&market=${market}&locale=${locale}`;
};
