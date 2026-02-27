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