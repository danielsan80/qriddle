export type RandomFn = () => number;

export type CreateRandomFn = (seed: string) => RandomFn;
