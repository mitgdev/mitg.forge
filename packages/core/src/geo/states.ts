import type { CountryCode } from "./countries";

export type StateCodeBR =
	| "AC"
	| "AL"
	| "AP"
	| "AM"
	| "BA"
	| "CE"
	| "DF"
	| "ES"
	| "GO"
	| "MA"
	| "MT"
	| "MS"
	| "MG"
	| "PA"
	| "PB"
	| "PR"
	| "PE"
	| "PI"
	| "RJ"
	| "RN"
	| "RS"
	| "RO"
	| "RR"
	| "SC"
	| "SP"
	| "SE"
	| "TO";

export type StateCodeUS = "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "NY";

export type StateCode = StateCodeBR | StateCodeUS;

export type State = {
	code: StateCode;
	name: string;
	countryCode: CountryCode;
};

export const STATES: readonly State[] = [
	// Brasil
	{ code: "AC", name: "Acre", countryCode: "BR" },
	{ code: "AL", name: "Alagoas", countryCode: "BR" },
	{ code: "AP", name: "Amapá", countryCode: "BR" },
	{ code: "AM", name: "Amazonas", countryCode: "BR" },
	{ code: "BA", name: "Bahia", countryCode: "BR" },
	{ code: "CE", name: "Ceará", countryCode: "BR" },
	{ code: "DF", name: "Distrito Federal", countryCode: "BR" },
	{ code: "ES", name: "Espírito Santo", countryCode: "BR" },
	{ code: "GO", name: "Goiás", countryCode: "BR" },
	{ code: "MA", name: "Maranhão", countryCode: "BR" },
	{ code: "MT", name: "Mato Grosso", countryCode: "BR" },
	{ code: "MS", name: "Mato Grosso do Sul", countryCode: "BR" },
	{ code: "MG", name: "Minas Gerais", countryCode: "BR" },
	{ code: "PA", name: "Pará", countryCode: "BR" },
	{ code: "PB", name: "Paraíba", countryCode: "BR" },
	{ code: "PR", name: "Paraná", countryCode: "BR" },
	{ code: "PE", name: "Pernambuco", countryCode: "BR" },
	{ code: "PI", name: "Piauí", countryCode: "BR" },
	{ code: "RJ", name: "Rio de Janeiro", countryCode: "BR" },
	{ code: "RN", name: "Rio Grande do Norte", countryCode: "BR" },
	{ code: "RS", name: "Rio Grande do Sul", countryCode: "BR" },
	{ code: "RO", name: "Rondônia", countryCode: "BR" },
	{ code: "RR", name: "Roraima", countryCode: "BR" },
	{ code: "SC", name: "Santa Catarina", countryCode: "BR" },
	{ code: "SP", name: "São Paulo", countryCode: "BR" },
	{ code: "SE", name: "Sergipe", countryCode: "BR" },
	{ code: "TO", name: "Tocantins", countryCode: "BR" },
	// ... resto dos estados BR

	// Estados Unidos (exemplo)
	{ code: "CA", name: "California", countryCode: "US" },
	{ code: "NY", name: "New York", countryCode: "US" },
	// ...
] as const;

export const STATE_CODES = STATES.map((s) => s.code) as StateCode[];
export function getStatesByCountry(countryCode: CountryCode): State[] {
	return STATES.filter((s) => s.countryCode === countryCode);
}
