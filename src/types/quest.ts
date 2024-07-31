import type {
	armyStats,
	asteroidSizes,
	asteroidTypes,
	asteroidValues,
	questTypes,
	unitIds,
} from "@/constants/quest-types";

type QuestType = keyof typeof questTypes;

type Asteroid = keyof typeof asteroidValues;

type AsteroidType = keyof typeof asteroidTypes;

type AsteroidSize = keyof typeof asteroidSizes;

type UnitId = (typeof unitIds)[number];

type ArmyStat = keyof typeof armyStats;

type QuestCondition =
	| {
			type: typeof questTypes.maxBaseExpansion;
			asteroid: Asteroid;
			size?: AsteroidSize;
	  }
	| {
			type: typeof questTypes.maxBaseLevel;
			asteroid: Asteroid;
			size?: AsteroidSize;
	  }
	| {
			type: typeof questTypes.conquerAsteroid;
			asteroidType: AsteroidType;
			size?: AsteroidSize;
	  }
	| {
			type: typeof questTypes.unitProduction;
			unit: UnitId;
			quantity?: number;
	  }
	| {
			type: typeof questTypes.armyProduction;
			stat: ArmyStat;
			quantity: number;
	  };

interface Quest {
	id: number;
	name: string;
	points: number;
	active: boolean;
	condition: QuestCondition;
	createdAt: Date;
}

export type { Quest, QuestType, QuestCondition };
