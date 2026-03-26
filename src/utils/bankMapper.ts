
const BANK_LOGOS: Record<string, any> = {
    hdfc: require("../assets/banks/hdfc.svg"),
    axis: require("../assets/banks/axis.svg"),
    sbi: require("../assets/banks/sbi.svg"),
};

const DEFAULT_LOGO = require("../assets/banks/hdfc.svg");

export const getBankLogo = (name: string) => {
    const key = name.toLowerCase();

    const match = Object.keys(BANK_LOGOS).find(bank =>
        key.includes(bank)
    );

    return match ? BANK_LOGOS[match] : DEFAULT_LOGO;
};