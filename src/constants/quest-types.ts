const questTypes = {
	unitProduction: "unit-production",
	conquerAsteroid: "conquer-asteroid",
	maxBaseExpansion: "max-base-expansion",
	maxBaseLevel: "max-base-level",
	armyProduction: "army-production",
} as const;

const asteroidValues = {
	home: "home",
	any: "any",
	elite: "elite",
	wormhole: "wormhole",
	regular: "regular",
} as const;

const asteroidTypes = {
	elite: "elite",
	wormhole: "wormhole",
	regular: "regular",
} as const;

const asteroidSizes = {
	small: "small",
	medium: "medium",
	large: "large",
} as const;

const unitIds = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const unitToId = {
	AegisDrone: 1,
	AnvilDrone: 2,
	StingerDrone: 3,
	HammerDrone: 4,
	MinutemanMarine: 5,
	TridentMarine: 6,
	LightningCraft: 7,
	ColonyShip: 8,
	Droid: 9,
} as const;

const armyStats = {
	ATK: "ATK",
	CTR: "CTR",
} as const;

export {
	questTypes,
	asteroidValues,
	asteroidTypes,
	asteroidSizes,
	unitIds,
	unitToId,
	armyStats,
};
