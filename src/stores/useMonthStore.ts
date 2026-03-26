import {create} from "zustand";

interface MonthState {
    year: number;
    month: number;

    setDate: (year: number, month: number) => void;
    nextMonth: () => void;
    prevMonth: () => void;
}

const now = new Date();

export const useMonthStore = create<MonthState>((set, get) => ({
    year: now.getFullYear(),
    month: now.getMonth() + 1,

    setDate: (year, month) =>
        set({year, month}),

    prevMonth: () => {
        const {year, month} = get();

        if (month === 1) {
            set({year: year - 1, month: 12});
        } else {
            set({year, month: month - 1});
        }
    },

    nextMonth: () => {
        const {year, month} = get();

        if (month === 12) {
            set({year: year + 1, month: 1});
        } else {
            set({year, month: month + 1});
        }
    },
}));