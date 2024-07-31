import { type Context, useContext } from "react";

interface UseContextFactoryProps<T> {
	name: string;
	context: Context<T>;
}

function useContextFactory<T>({ name, context }: UseContextFactoryProps<T>): T {
	const contextInstance = useContext<T>(context);
	if (context === undefined) {
		throw new Error(
			`use${name}Context must be used withing a ${name}ContextProvider.`,
		);
	}

	return contextInstance;
}

export default useContextFactory;
