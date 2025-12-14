import { useCallback, useMemo, useState } from "react";

export type FormatterOptions = {
	locale?: string;
	currency?: string;
	// Quando true, o valor é tratado como inteiro em centavos.
	cents?: boolean;
};

export const formatter = (
	value: number,
	options: FormatterOptions & {
		cents?: boolean;
	} = {},
): string => {
	const { locale = "pt-BR", currency = "BRL", cents = false } = options;

	const displayValue = cents ? value / 100 : value;

	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
	}).format(displayValue);
};

export const useFormatter = (
	initialValue = 0,
	options: FormatterOptions = {},
) => {
	const { cents = false } = options;

	// Quando cents=true, armazenamos o estado como inteiro (centavos).
	const [value, setValue] = useState<number>(initialValue);

	const formatted = useMemo(() => formatter(value, options), [value, options]);

	const onChange = useCallback(
		(raw: string) => {
			const onlyNumbers = raw.replace(/[^\d]/g, "");
			if (cents) {
				// Mantém valor como inteiro em centavos
				const num = Number(onlyNumbers);
				setValue(num);
			} else {
				// Valor em reais com duas casas, armazenado como float
				const num = Number(onlyNumbers) / 100;
				setValue(num);
			}
		},
		[cents],
	);

	return {
		// value será inteiro (centavos) quando cents=true, ou float quando cents=false
		value,
		formatted,
		onChange,
		setValue,
	};
};
