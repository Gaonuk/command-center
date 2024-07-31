import { put } from "@/lib/api";
import type { Quest } from "@/types";

const activateQuest = async (id: number) => {
	const quests = await put<{ id: number }, Quest>("/quests/activate", { id });

	return quests.data;
};

export default activateQuest;
