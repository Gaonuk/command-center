interface Transaction {
	id: number;
	function_name: string;
	args: string[];
	wallet: string;
	timestamp: string;
	hash: string;
}

export type { Transaction };
