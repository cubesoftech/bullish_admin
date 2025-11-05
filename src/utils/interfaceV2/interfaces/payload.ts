import { MemberRoles, WithdrawalStatus, TransactionStatus, MemberTrades, TransactionType } from ".";

export interface RefreshTokenPayload {
    refreshToken: string;
}
export interface LoginPayload {
    email: string;
    password: string;
}
export interface UpdateMasterAgentStatusPayload {
    masterAgentId: string;
    status: boolean;
}
export interface CreateAgentPayload {
    name: string;
    email: string;
    password: string;
    nickname: string;
    royalty: number;
    masterAgentId: string;
}
export interface UpdateWithdrawalStatusPayload {
    id: string;
    status: WithdrawalStatus;
}
export interface UpdateMemberTradePayload {
    tradeID: string;
    membersId: string;
    newAmount: number
}
export interface UpdateTradeResultPayload {
    tradeId: string;
    result: boolean;
}
export interface CreateAnnouncementPayload {
    title: string;
    content: string;
}
export interface CreateDepositPayload {
    amount: number;
    membersID: string;
    memberRole: MemberRoles;
}
export interface CreateMasterAgentPayload {
    email: string;
    name: string;
    nickname: string;
    password: string;
    royalty: number;
}
export interface DeleteAnnouncementPayload {
    announcementId: string
}
export interface DeleteTransactionsPayload {
    transactionIds: string[]
}
export interface DeleteInquryPayload {
    inquiryId: string
}
export interface DeleteMasterAgentPayload {
    masterAgentId: string
}
export interface UpdateAnnouncementPayload {
    announcementId: string;
    newTitle: string;
    newContent: string;
}
export interface ReplyInquiryPayload {
    inquiryId: string;
    reply: string;
}
export interface UpdateTransactionPayload {
    transactionId: string;
    newStatus: TransactionStatus;
    type: TransactionType;
}
export interface UpdateUserPayload {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    bank: string;
    accountNumber: string;
    accountHolder: string;
    balance: number;
    nickname: string;
    password: string;
    status: boolean
}
export interface GetInjectedSettingsPayload {
    userId: string
}
export interface GetUserDetailsPayload {
    userId: string
}
export interface GetUserTradesPayload {
    userId: string
}
export interface GetAgentWithdrawalsPayload {
    membersId: string;
    role: MemberRoles;
}
export interface InjectSettingsPayload {
    settingsId?: string;
    userId: string;
    multiplier: number;
    status: boolean;
}
export interface MaxbetTradePayload {
    tradeId: string;
    memberId: string;
    status: boolean;
}
export interface UpdateMasterAgentPayload {
    masterAgentId: string;
    membersId: string;
    password: string;
    royalty: number;
}
export interface SwitchTradePayload {
    tradeId: string;
    value: boolean
}
export interface UpdateUserMaxbetPayload {
    userId: string;
    value: boolean
}
export interface UpdateSiteSettingsPayload {
    returnOnWin: number;
    oneMinLock: number;
    threeMinLock: number;
    fiveMinLock: number;
    eurusd: boolean;
    gold: boolean;
    nasdaq: boolean;
    nvda: boolean;
    pltr: boolean;
    tsla: boolean;
    minimumAmount: number;
}
export interface ForceLogoutUserPayload {
    userId: string;
    forceLogout: boolean;
}
export interface UpdateUserSwitchBetPayload {
    userId: string;
    status: boolean
}
export interface UpdateUserTradesPayload {
    userId: string;
    nasdaq: MemberTrades;
    gold: MemberTrades;
    eurusd: MemberTrades;
    nvda: MemberTrades;
    pltr: MemberTrades;
    tsla: MemberTrades;
}
export interface DeleteUsersPayload {
    userIds: string[]
}