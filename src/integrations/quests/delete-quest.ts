import { del } from "@/lib/api";

const deleteQuest = async (id: number) => {
	const message = await del<{ message: string }>(`/quests/delete/${id}`);

	return message;
};

export default deleteQuest;
