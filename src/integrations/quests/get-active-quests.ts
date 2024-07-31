import { get } from "@/lib/api";
import type { Quest } from "@/types";

const getActiveQuests = async () => {
	const quests = await get<Quest[]>("/quests/active");

	return quests.data;
};

export default getActiveQuests;
