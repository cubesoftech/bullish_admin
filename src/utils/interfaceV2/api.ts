import axios from "axios";

import { useTokenStore, useAuthentication } from "../storage";

import {
    GetAnnouncementParams,
    GetDepositParams,
    GetIncomeParams,
    GetInquiriesParams,
    GetTradeHistoryParams,
    GetUserParams,
    GetWithdrawalsParams
} from "@/utils/interfaceV2/interfaces/params"
import {
    CreateAgentPayload,
    CreateAnnouncementPayload,
    CreateDepositPayload,
    CreateMasterAgentPayload,
    DeleteAnnouncementPayload,
    DeleteInquryPayload,
    DeleteMasterAgentPayload,
    DeleteTransactionsPayload,
    ForceLogoutUserPayload,
    GetAgentWithdrawalsPayload,
    GetInjectedSettingsPayload,
    GetUserDetailsPayload,
    GetUserTradesPayload,
    InjectSettingsPayload,
    LoginPayload,
    MaxbetTradePayload,
    RefreshTokenPayload,
    ReplyInquiryPayload,
    SwitchTradePayload,
    UpdateAnnouncementPayload,
    UpdateMasterAgentPayload,
    UpdateMasterAgentStatusPayload,
    UpdateMemberTradePayload,
    UpdateSiteSettingsPayload,
    UpdateTradeResultPayload,
    UpdateTransactionPayload,
    UpdateUserMaxbetPayload,
    UpdateUserPayload,
    UpdateUserSwitchBetPayload,
    UpdateUserTradesPayload,
    UpdateWithdrawalStatusPayload,
    DeleteUsersPayload
} from "@/utils/interfaceV2/interfaces/payload"
import {
    DefaultPostResponse,
    GetAgentWithdrawalsResponse,
    GetAnnouncementResponse,
    GetChangesResponse,
    GetDepositsResponse,
    GetIncomeResponse,
    GetInjectedSettingsResponse,
    GetInquiriesResponse,
    GetMasterAgentsResponse,
    GetOngoingTradesResponse,
    GetSiteSettingsResponse,
    GetTradeHistoryResponse,
    GetTradesResponse,
    GetUserDetailsResponse,
    GetUserResponse,
    GetUserTradesResponse,
    GetWithdrawalsResponse,
    LoginResponse,
    RefreshTokenResponse
} from "@/utils/interfaceV2/interfaces/responses"


export const serverUrl = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "https://server.bullish-korea.com"
const serverAdminUrl = serverUrl + "/admin"


let axiosInstance = axios.create({
    baseURL: serverAdminUrl,
    timeout: 10_000,
});
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = useTokenStore.getState().a;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = useTokenStore.getState().a2
            if (!refreshToken) {
                useTokenStore.getState().sa(null);
                useTokenStore.getState().sa2(null);
                useAuthentication.getState().changeAuthentication(false, "ADMIN", "", "");
                window.location.href = '/';

                return Promise.reject(error)
            }

            try {
                const payload: RefreshTokenPayload = {
                    refreshToken
                }
                const { data } = await axios.post<RefreshTokenResponse>(`${serverAdminUrl}/refreshToken`, payload)
                const { data1, data2 } = data.data
                useTokenStore.getState().sa(data1);
                useTokenStore.getState().sa2(data2);
                originalRequest.headers['Authorization'] = `Bearer ${data1}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useTokenStore.getState().sa(null);
                useTokenStore.getState().sa2(null);
                useAuthentication.getState().changeAuthentication(false, "ADMIN", "", "");
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);


// ---------- API Functions ----------
// Generic POST request function
const handlePostRequest = async <response>(url: string, payload?: any) => {
    try {
        const { data } = await axiosInstance.post<response>(`/${url}`, payload);
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Something went wrong.";
        throw message;
    }
}
const handlePostRequestv2 = async <response>(url: string, payload?: any) => {
    try {
        const { data } = await axiosInstance.post<response>(`/${url}`, payload);
        return data;
    } catch (error: any) {
        throw error;
    }
}
// Generic GET request function
const handleGetRequest = async <response>(url: string, params?: any) => {
    try {
        const { data } = await axiosInstance.get<response>(`/${url}`, { params });
        return data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Something went wrong.";
        throw message;
    }
}

class API {
    // ---------- GET REQUESTS ---------- //
    // ---------- SECURED GET REQUESTS ---------- //
    async getAnnouncement(params: GetAnnouncementParams) {
        return handleGetRequest<GetAnnouncementResponse>('getAnnouncement', params)
    };
    async getDeposits(params: GetDepositParams) {
        return handleGetRequest<GetDepositsResponse>('getDeposits', params)
    };
    async getInquiries(params: GetInquiriesParams) {
        return handleGetRequest<GetInquiriesResponse>('getInquiries', params)
    };
    async getMasterAgents() {
        return handleGetRequest<GetMasterAgentsResponse>('getMasterAgents')
    };
    async getOngoingTrades() {
        return handleGetRequest<GetOngoingTradesResponse>('getOngoingTrades')
    };
    async getTradeHistory(params: GetTradeHistoryParams) {
        return handleGetRequest<GetTradeHistoryResponse>('getTradeHistory', params)
    };
    async getUser(params: GetUserParams) {
        return handleGetRequest<GetUserResponse>('getUser', params)
    };
    async getWithdrawals(params: GetWithdrawalsParams) {
        return handleGetRequest<GetWithdrawalsResponse>('getWithdrawals', params)
    };
    async getIncome(params: GetIncomeParams) {
        return handleGetRequest<GetIncomeResponse>('getIncome', params)
    };
    async getSiteSettings() {
        return handleGetRequest<GetSiteSettingsResponse>('getSiteSettings')
    };
    async getChanges() {
        return handleGetRequest<GetChangesResponse>('getChanges')
    };
    async getTrades() {
        return handleGetRequest<GetTradesResponse>('getTrades')
    };


    // ---------- POST REQUESTS ---------- //
    // ---------- UNSECURED POST REQUESTS ---------- //
    async login(payload: LoginPayload) {
        return handlePostRequest<LoginResponse>('login', payload)
    };

    // ---------- SECURED POST REQUESTS ---------- //
    async updateMasterAgentStatus(payload: UpdateMasterAgentStatusPayload) {
        return handlePostRequest<DefaultPostResponse>('updateMasterAgentStatus', payload)
    };
    async createAgent(payload: CreateAgentPayload) {
        return handlePostRequest<DefaultPostResponse>('createAgent', payload)
    };
    async updateWithdrawalStatus(payload: UpdateWithdrawalStatusPayload) {
        return handlePostRequest<DefaultPostResponse>('updateWithdrawalStatus', payload)
    };
    async updateMemberTrade(payload: UpdateMemberTradePayload) {
        return handlePostRequest<DefaultPostResponse>('updateMemberTrade', payload)
    };
    async updateTradeResult(payload: UpdateTradeResultPayload) {
        return handlePostRequest<DefaultPostResponse>('updateTradeResult', payload)
    };
    async createAnnouncement(payload: CreateAnnouncementPayload) {
        return handlePostRequest<DefaultPostResponse>('createAnnouncement', payload)
    };
    async createDeposit(payload: CreateDepositPayload) {
        return handlePostRequest<DefaultPostResponse>('createDeposit', payload)
    };
    async createMasterAgent(payload: CreateMasterAgentPayload) {
        return handlePostRequest<DefaultPostResponse>('createMasterAgent', payload)
    };
    async deleteAnnouncement(payload: DeleteAnnouncementPayload) {
        return handlePostRequest<DefaultPostResponse>('deleteAnnouncement', payload)
    };
    async deleteTransactions(payload: DeleteTransactionsPayload) {
        return handlePostRequest<DefaultPostResponse>('deleteTransactions', payload)
    };
    async deleteInquiry(payload: DeleteInquryPayload) {
        return handlePostRequest<DefaultPostResponse>('deleteInquiry', payload)
    };
    async deleteMasterAgent(payload: DeleteMasterAgentPayload) {
        return handlePostRequest<DefaultPostResponse>('deleteMasterAgent', payload)
    };
    async updateAnnouncement(payload: UpdateAnnouncementPayload) {
        return handlePostRequest<DefaultPostResponse>('updateAnnouncement', payload)
    };
    async replyInquiry(payload: ReplyInquiryPayload) {
        return handlePostRequest<DefaultPostResponse>('replyInquiry', payload)
    };
    async updateTransaction(payload: UpdateTransactionPayload) {
        return handlePostRequest<DefaultPostResponse>('updateTransaction', payload)
    };
    async updateUserDetails(payload: UpdateUserPayload) {
        return handlePostRequest<DefaultPostResponse>('updateUserDetails', payload)
    };
    async getInjectedSettings(payload: GetInjectedSettingsPayload) {
        return handlePostRequest<GetInjectedSettingsResponse>('getInjectedSettings', payload)
    };
    async getUserDetails(payload: GetUserDetailsPayload) {
        return handlePostRequest<GetUserDetailsResponse>('getUserDetails', payload)
    };
    async getUserTrades(payload: GetUserTradesPayload) {
        return handlePostRequest<GetUserTradesResponse>('getUserTrades', payload)
    };
    async getAgentWithdrawals(payload: GetAgentWithdrawalsPayload) {
        return handlePostRequest<GetAgentWithdrawalsResponse>('getAgentWithdrawals', payload)
    };
    async injectSettings(payload: InjectSettingsPayload) {
        return handlePostRequest<DefaultPostResponse>('injectSettings', payload)
    };
    async updateTradeMaxbet(payload: MaxbetTradePayload) {
        return handlePostRequest<DefaultPostResponse>('updateTradeMaxbet', payload)
    };
    async updateMasterAgent(payload: UpdateMasterAgentPayload) {
        return handlePostRequest<DefaultPostResponse>('updateMasterAgent', payload)
    };
    async switchTrade(payload: SwitchTradePayload) {
        return handlePostRequest<DefaultPostResponse>('switchTrade', payload)
    };
    async updateUserMaxbet(payload: UpdateUserMaxbetPayload) {
        return handlePostRequest<DefaultPostResponse>('updateUserMaxbet', payload)
    };
    async updateSiteSettings(payload: UpdateSiteSettingsPayload) {
        return handlePostRequest<DefaultPostResponse>('updateSiteSettings', payload)
    };
    async forceLogoutUser(payload: ForceLogoutUserPayload) {
        return handlePostRequest<DefaultPostResponse>('forceLogoutUser', payload)
    };
    async updateUserSwitchBet(payload: UpdateUserSwitchBetPayload) {
        return handlePostRequest<DefaultPostResponse>('updateUserSwitchBet', payload)
    };
    async updateUserTrades(payload: UpdateUserTradesPayload) {
        return handlePostRequest<DefaultPostResponse>('updateUserTrades', payload)
    };
    async deleteUsers(payload: DeleteUsersPayload) {
        return handlePostRequest<DefaultPostResponse>('deleteUsers', payload)
    };
}
const api = new API()

export default api