import { put } from "@/lib/api";
import type { Quest } from "@/types";

const deactivateQuest = async (id: number) => {
	console.log("id", id);
	const quests = await put<{ id: number }, Quest>("/quests/deactivate", { id });

	return quests.data;
};

export default deactivateQuest;
