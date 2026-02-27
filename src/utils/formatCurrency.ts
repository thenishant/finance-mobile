export const formatCurrency = (
    value: string,
    currency: string = "INR"
) => {
    if (!value) return "";

    const numeric = Number(value.replace(/[^0-9.]/g, ""));

    if (isNaN(numeric)) return "";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(numeric);
};

export const formatCurrencyNumber = (
    value: number,
    currency: string = "INR"
) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatCurrencyCompact = (value: number) => {
    const abs = Math.abs(value);

    const format = (num: number) =>
        Number.isInteger(num) ? num : num.toFixed(1);

    if (abs >= 1_00_00_000) {
        return `₹ ${format(value / 1_00_00_000)}Cr`;
    }

    if (abs >= 1_00_000) {
        return `₹ ${format(value / 1_00_000)}L`;
    }

    if (abs >= 1_000) {
        return `₹ ${format(value / 1_000)}K`;
    }

    return `₹ ${value}`;
};