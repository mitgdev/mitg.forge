import { ORPCError } from "@orpc/client";
import { useCallback, useEffect, useState } from "react";

const CAUSE_TWO_FACTOR_TOKEN_MISSING = "TWO_FACTOR_TOKEN_MISSING";

export const useTwoFactor = (error?: Error | null) => {
	const [twoFactorOpen, setTwoFactorOpen] = useState(false);

	const isTwoFactorError = useCallback((err?: Error | null) => {
		if (!(err instanceof ORPCError)) return false;

		const hasTwoFactorCause =
			err?.data?.cause === CAUSE_TWO_FACTOR_TOKEN_MISSING;

		if (!hasTwoFactorCause) return false;

		setTwoFactorOpen(true);
		return true;
	}, []);

	// Reagir sempre que o erro de fora mudar
	useEffect(() => {
		if (!error) return;
		isTwoFactorError(error);
	}, [error, isTwoFactorError]);

	return {
		twoFactorOpen,
		setTwoFactorOpen,
		isTwoFactorError,
	};
};
