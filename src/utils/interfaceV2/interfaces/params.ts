import { MemberRoles } from ".";

// ----------- DEFAULT PARAMS ----------
// please extend to shape your params
export interface DefaultParams {
    limit?: number;
    page?: number;
}

// ----------- CUSTOM PARAMS ----------
export interface GetAnnouncementParams extends DefaultParams {
    search?: string;
}
export interface GetDepositParams extends GetAnnouncementParams {
    startDate?: string;
    endDate?: string;
}
export interface GetInquiriesParams extends GetAnnouncementParams {
    filter?: "all" | "deposit"
}
export interface GetTradeHistoryParams extends DefaultParams {
    role?: MemberRoles;
    id?: string;
}
export interface GetUserParams extends DefaultParams {
    role?: MemberRoles;
    id?: string;
}
export interface GetWithdrawalsParams extends GetAnnouncementParams {
    startDate?: string;
    endDate?: string;
}
export interface GetIncomeParams {
    month?: number;
    role?: MemberRoles;
    id?: string;
}