import type { questTypes } from "@/constants/quest-types";

type QuestType = keyof typeof questTypes;

interface Quest {
	id: number;
	name: string;
	points: number;
	active: boolean;
	quest_type: QuestType;
	condition: object;
	created_at: Date;
}

export type { Quest, QuestType };
