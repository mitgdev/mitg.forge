export async function FileToText(file: File): Promise<string> {
	const contentType = file.type || "text/plain;charset=utf-8";
	const m = /charset=([^;]+)/i.exec(contentType);
	const encoding = m?.[1]?.toLowerCase() || "utf-8";
	const buffer = await file.arrayBuffer();

	return new TextDecoder(encoding).decode(buffer);
}
