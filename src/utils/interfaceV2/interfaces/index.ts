export type MemberRoles = "USER" | "AGENT" | "MASTER_AGENT" | "ADMIN"
export type WithdrawalStatus = "completed" | "failed"
export type TransactionStatus = "completed" | "failed" | "pending"
export type MemberTrades = "nasdaq" | "gold" | "eurusd" | "nvda" | "pltr" | "tsla"
export type TransactionType = "deposit" | "withdrawal"
export type MemberTradesType = "nasdaq_1_min" | "nasdaq_3_mins" | "nasdaq_5_mins" | "gold_1_min" | "gold_3_mins" | "gold_5_mins" | "eurusd_1_min" | "eurusd_3_mins" | "eurusd_5_mins" | "pltr_1_min" | "pltr_3_mins" | "pltr_5_mins" | "tsla_1_min" | "tsla_3_mins" | "tsla_5_mins" | "nvda_1_min" | "nvda_3_mins" | "nvda_5_mins"

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}