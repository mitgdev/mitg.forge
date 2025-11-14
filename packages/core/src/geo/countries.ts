export type CountryCode = "BR" | "US"; // depois você vai expandindo

export type Country = {
	code: CountryCode;
	name: string;
	phoneCode?: string;
	currencyCode?: string;
};

export const COUNTRIES: readonly Country[] = [
	{
		code: "BR",
		name: "Brazil",
		phoneCode: "+55",
		currencyCode: "BRL",
	},
	{
		code: "US",
		name: "United States",
		phoneCode: "+1",
		currencyCode: "USD",
	},
] as const;

export const COUNTRY_CODES = COUNTRIES.map((c) => c.code) as CountryCode[];
