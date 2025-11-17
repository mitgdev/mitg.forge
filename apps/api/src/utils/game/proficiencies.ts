type WeaponPerk = {
	proficiency_level: number;
	perk_position: number;
};

type WeaponProficiency = {
	item_id: number;
	experience: number;
	active_perks: WeaponPerk[];
};

export function parseWeaponProficiencies(
	data?: Uint8Array | null,
): WeaponProficiency[] {
	try {
		if (!data) {
			return [];
		}

		if (data.length === 0) {
			return [];
		}

		const buf = Buffer.from(data);
		let offset = 0;

		const count = buf.readUInt16LE(offset);
		offset += 2;

		const result: WeaponProficiency[] = [];

		for (let i = 0; i < count; i++) {
			const itemId = buf.readUInt16LE(offset);
			offset += 2;

			const experience = buf.readUInt32LE(offset);
			offset += 4;

			const perksCount = buf.readUInt8(offset);
			offset += 1;

			const activePerks: WeaponPerk[] = [];

			for (let j = 0; j < perksCount; j++) {
				const proficiencyLevel = buf.readUInt8(offset);
				offset += 1;

				const perkPosition = buf.readUInt8(offset);
				offset += 1;

				activePerks.push({
					proficiency_level: proficiencyLevel,
					perk_position: perkPosition,
				});
			}

			result.push({
				item_id: itemId,
				experience,
				active_perks: activePerks,
			});
		}

		return result;
	} catch {
		return [];
	}
}
