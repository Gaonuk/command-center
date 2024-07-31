import { get } from "@/lib/api";
import type { Quest } from "@/types";

const getAllQuests = async () => {
	const quests = await get<Quest[]>("/quests/all");

	return quests.data;
};

export default getAllQuests;
