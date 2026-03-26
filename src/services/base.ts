export const normalizeAmount = (value: string | number) =>
    typeof value === "number" ? value.toString() : value;

export const toNullable = <T>(v: T | undefined | null) =>
    v ?? null;

export const unwrap = <T>(res: any): T =>
    res.data.data;