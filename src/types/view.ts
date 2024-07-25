import type views from "@/lib/views";

type View = (typeof views)[keyof typeof views];

export type { View };
