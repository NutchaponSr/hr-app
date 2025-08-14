export const layouts = ["table"] as const;

export type LayoutVariant = (typeof layouts)[number];