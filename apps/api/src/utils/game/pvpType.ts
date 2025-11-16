const PvpType = {
	PVP: 0,
	NO_PVP: 1,
	PVP_ENFORCED: 2,
	RETRO_PVP: 3,
	RETRO_HARDCORE: 4,
} as const;

export type PvpType = (typeof PvpType)[keyof typeof PvpType];

export const getPvpTypeId = (type: keyof typeof PvpType): PvpType => {
	return PvpType[type];
};
