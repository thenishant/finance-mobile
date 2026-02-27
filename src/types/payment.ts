export const PAYMENT_METHODS = [
    "CASH",
    "BANK",
    "CREDIT_CARD",
    "UPI"
] as const;

export type PaymentMethod =
    typeof PAYMENT_METHODS[number];