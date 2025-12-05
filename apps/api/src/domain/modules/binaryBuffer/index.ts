export class BinaryBuffer {
	private buffer: Buffer;
	private pos: number;

	constructor(initial: Buffer | string = Buffer.alloc(0)) {
		this.buffer = Buffer.isBuffer(initial) ? initial : Buffer.from(initial);
		this.pos = 0;
	}

	static from(initial: Buffer | string): BinaryBuffer {
		return new BinaryBuffer(initial);
	}

	getBuffer(): Buffer {
		return this.buffer;
	}

	setBuffer(buffer: Buffer): void {
		this.buffer = buffer;
		this.pos = 0;
	}

	isValid(): boolean {
		return this.pos < this.buffer.length;
	}

	private ensure(size: number): void {
		if (this.pos + size > this.buffer.length) {
			throw new Error("OutOfBuffer");
		}
	}

	// getChar / putChar
	getChar(): number {
		this.ensure(1);
		const value = this.buffer.readUInt8(this.pos);
		this.pos += 1;
		return value;
	}

	putChar(char: number): void {
		const chunk = Buffer.alloc(1);
		chunk.writeUInt8(char & 0xff, 0);
		this.buffer = Buffer.concat([this.buffer, chunk]);
	}

	getShort(): number {
		this.ensure(2);
		const value = this.buffer.readUInt16LE(this.pos);
		this.pos += 2;
		return value;
	}

	putShort(short: number): void {
		const chunk = Buffer.alloc(2);
		chunk.writeUInt16LE(short & 0xffff, 0);
		this.buffer = Buffer.concat([this.buffer, chunk]);
	}

	getLong(): number {
		this.ensure(4);
		const value = this.buffer.readUInt32LE(this.pos);
		this.pos += 4;
		return value;
	}

	putLong(long: number): void {
		const chunk = Buffer.alloc(4);
		chunk.writeUInt32LE(long >>> 0, 0);
		this.buffer = Buffer.concat([this.buffer, chunk]);
	}

	getString(length?: number): Buffer {
		let len = length;
		len ??= this.getShort();

		this.ensure(len);
		const value = this.buffer.subarray(this.pos, this.pos + len);
		this.pos += len;
		return value;
	}

	/**
	 * Escreve string binária.
	 * dynamic = true → prefixa com short de tamanho
	 * dynamic = false → só escreve os bytes da string
	 */
	putString(value: string | Buffer, dynamic = true): void {
		const buf = Buffer.isBuffer(value) ? value : Buffer.from(value, "binary");
		if (dynamic) {
			this.putShort(buf.length);
		}
		this.buffer = Buffer.concat([this.buffer, buf]);
	}

	reset(): void {
		this.buffer = Buffer.alloc(0);
		this.pos = 0;
	}

	getPos(): number {
		return this.pos;
	}

	setPos(pos: number): void {
		this.pos = pos;
	}

	getSize(): number {
		return this.buffer.length;
	}

	skip(n: number): void {
		this.ensure(n);
		this.pos += n;
	}

	toString(encoding: BufferEncoding = "utf8"): string {
		return this.buffer.toString(encoding);
	}
}
