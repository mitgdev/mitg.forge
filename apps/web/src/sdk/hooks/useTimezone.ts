import { useMemo, useState } from "react";

export const formatter = (
	date: Date,
	locale: string,
	options?: Intl.DateTimeFormatOptions,
) => {
	return new Intl.DateTimeFormat(locale, options).format(date);
};

export const useTimezone = () => {
	const [locale] = useState(navigator.language || "en-US");

	const formatDate = useMemo(
		() => (date: Date, options?: Intl.DateTimeFormatOptions) =>
			formatter(date, locale, {
				year: "numeric",
				month: "long",
				day: "numeric",
				...options,
			}),
		[locale],
	);

	return {
		formatDate,
		locale,
	};
};
