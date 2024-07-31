import { get } from "@/lib/api";
import type { Transaction } from "@/types";

const getWalletTransactions = async (address: `0x${string}`) => {
	const transactions = await get<Transaction[]>(
		`/transactions/${address.toLowerCase()}`,
	);

	console.log("transactions", transactions);

	return transactions.data;
};

export default getWalletTransactions;
