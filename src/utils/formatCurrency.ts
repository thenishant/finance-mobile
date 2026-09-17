export interface FormatCurrencyOptions {
    currency?: string;
    compact?: boolean;
    maximumFractionDigits?: number;
    showSign?: boolean;
}

const formatCompact = (
    value: number,
): string => {

    const abs = Math.abs(value);

    const format = (num: number) =>
        Number.isInteger(num)
            ? num.toString()
            : num.toFixed(1);

    if (abs >= 1_00_00_000) {
        return `₹${format(value / 1_00_00_000)}Cr`;
    }

    if (abs >= 1_00_000) {
        return `₹${format(value / 1_00_000)}L`;
    }

    if (abs >= 1_000) {
        return `₹${format(value / 1_000)}K`;
    }

    return `₹${value}`;
};

export const formatCurrency = (
    value: number | string,
    options: FormatCurrencyOptions = {},
): string => {

    const {
        currency = "INR",
        compact = false,
        maximumFractionDigits = 2,
        showSign = false,
    } = options;

    const numeric =
        typeof value === "number"
            ? value
            : Number(
                value.replace(
                    /[^0-9.-]/g,
                    "",
                ),
            );

    if (Number.isNaN(numeric)) {
        return "";
    }

    if (compact) {
        return formatCompact(numeric);
    }

    const formatted =
        new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency,
                maximumFractionDigits,
            },
        ).format(numeric);

    if (!showSign || numeric === 0) {
        return formatted;
    }

    return numeric > 0
        ? `+${formatted}`
        : formatted;
};