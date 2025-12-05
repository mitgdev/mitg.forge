export type ExecutionSource = "http" | "discord";

export interface ExecutionContext {
	source(): ExecutionSource;
	ip(): string | null;
	userAgent(): string | null;
	bearer(): string | null;
	bearerFromCookies(): string | null;
	requestId(): string | null;
	session(): AuthenticatedSession;
	sessionOrNull(): AuthenticatedSession | null;
}
