import type { Quest } from "@/types";

const quests: Quest[] = [
	{
		id: 1,
		name: "Produce a Capital Ship",
		points: 3,
		active: true,
		quest_type: "unit-production",
		condition: {
			unit: 8,
			quantity: 1,
		},
		created_at: new Date(),
	},
	{
		id: 2,
		name: "Capture a Wormhole",
		points: 15,
		active: true,
		quest_type: "conquer-asteroid",
		condition: {
			quest_type: "wormhole",
		},
		created_at: new Date(),
	},
	{
		id: 3,
		name: "Reach Max Base Expansion",
		points: 30,
		active: true,
		quest_type: "base-expansion",
		condition: {
			asteroid: "home",
			level: 6,
		},
		created_at: new Date(),
	},
	{
		id: 4,
		name: "Conquer a Small Elite Resource Asteroid",
		points: 30,
		active: true,
		quest_type: "conquer-asteroid",
		condition: {
			size: "small",
			elite: true,
		},
		created_at: new Date(),
	},
	{
		id: 5,
		name: "Reach Max Base Level",
		points: 90,
		active: true,
		quest_type: "base-level",
		condition: {
			asteroid: "home",
			level: 6,
		},
		created_at: new Date(),
	},
	{
		id: 6,
		name: "Conquer a Medium Elite Resource Asteroid",
		points: 90,
		active: true,
		quest_type: "conquer-asteroid",
		condition: {
			size: "medium",
			elite: true,
		},
		created_at: new Date(),
	},
	{
		id: 7,
		name: "Conquer a Large Elite Resource Asteroid",
		points: 270,
		active: true,
		quest_type: "conquer-asteroid",
		condition: {
			size: "large",
			elite: true,
		},
		created_at: new Date(),
	},
];

export { quests };
