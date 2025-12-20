import { useCallback, useMemo, useState } from "react";

export type FormatterOptions = {
	locale?: string;
	currency?: string;
	cents?: boolean;
};

export const formatter = (
	value: number,
	options: FormatterOptions = {},
): string => {
	const { locale = "pt-BR", currency = "BRL" } = options;

	const finalValue = options.cents ? value / 100 : value;

	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
	}).format(finalValue);
};

export const useFormatter = (
	initialValue = 0,
	options: FormatterOptions = {},
) => {
	const [value, setValue] = useState(initialValue);

	const formatted = useMemo(() => formatter(value, options), [value, options]);

	const onChange = useCallback((raw: string) => {
		const onlyNumbers = raw.replace(/[^\d]/g, "");
		const num = Number(onlyNumbers) / 100;
		setValue(num);
	}, []);

	return {
		value,
		formatted,
		onChange,
		setValue,
	};
};
