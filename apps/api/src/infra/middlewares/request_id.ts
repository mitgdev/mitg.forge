import { requestId } from "hono/request-id";

export function honoRequestId() {
	return requestId();
}
