export const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

export const formatCompactCurrency = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 1e7) {
        return `₹${(value / 1e7).toFixed(1).replace(/\.0$/, "")}Cr`;
    }
    if (abs >= 1e5) {
        return `₹${(value / 1e5).toFixed(1).replace(/\.0$/, "")}L`;
    }
    if (abs >= 1e3) {
        return `₹${(value / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
};