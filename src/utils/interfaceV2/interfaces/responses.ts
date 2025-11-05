import { Announcement, MemberRoles, MemberTrades } from ".";
import { UserTransaction, Inqury, Masteragent, OngoingTradeResult, OrderHistory, Members, Site, UserTrades, TradeLock } from "@/utils/interface";
import { GetIncomeInterface, WithdrawalAgent } from "@/utils/interface_v2";
import { Member, Recentrade, Tansaction } from "@/pages/components/Dashboard/User";

// ----------- DEFAULT RESPONSE ----------
// please extend to shape your response
export interface DefaultGetResponse {
    total: number;
}
export interface DefaultGetResponseV2 {
    hasMore: boolean;
}
export interface DefaultPostResponse {
    message: string;
}

// ----------- CUSTOM GET RESPONSE ----------

export interface GetAnnouncementResponse extends DefaultGetResponse {
    data: Announcement[]
}
export interface GetDepositsResponse extends DefaultGetResponseV2 {
    deposits: UserTransaction[]
}
export interface GetInquiriesResponse extends DefaultGetResponseV2 {
    inquries: Inqury[]
}
export interface GetMasterAgentsResponse {
    masteragents: Masteragent[]
}
export interface GetOngoingTradesResponse {
    data: OngoingTradeResult
}
export interface GetTradeHistoryResponse extends DefaultGetResponseV2 {
    orderHistory: OrderHistory[]
}
export interface GetUserResponse extends DefaultGetResponseV2 {
    users: Members[]
}
export interface GetWithdrawalsResponse extends DefaultGetResponseV2 {
    withdrawals: UserTransaction[]
}
export interface GetIncomeResponse {
    data: GetIncomeInterface
}
export interface GetSiteSettingsResponse {
    data: Site
}
export interface GetChangesResponse {
    depositCount: number;
    withdrawalCount: number;
    inquiryCount: number;
    depositInquiryCount: number;
}
export type GetTradesResponse = TradeLock


// ----------- CUSTOM POST RESPONSE ----------
export interface LoginResponse extends DefaultPostResponse {
    data: {
        role: MemberRoles,
        id: string;
        userId: string;
        data1: string;
        data2: string;
    }
}
export interface RefreshTokenResponse {
    data: {
        data1: string;
        data2: string;
    }
}
export interface GetInjectedSettingsResponse {
    data: {
        id: string;
        multiplier: number;
        status: boolean;
        userId: string;
        createdAt: string;
    }
}
export interface GetUserDetailsResponse {
    member: Member;
    recentrades: Recentrade[];
    tansactions: Tansaction[];
}
export interface GetUserTradesResponse {
    data: UserTrades
}
export interface GetAgentWithdrawalsResponse {
    data: WithdrawalAgent[]
}