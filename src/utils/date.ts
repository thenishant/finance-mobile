export function formatDate(date: string) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) {
        return "Today";
    }
    if (d.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }
    const diff = Math.floor(
        (today.getTime() - d.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diff < 7) {
        return `${diff} days ago`;
    }

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });

}

export const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const same = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (same(date, today)) return "Today";
    if (same(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatDateTime = (date?: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(date));
};