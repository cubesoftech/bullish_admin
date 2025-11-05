import { MemberTradesType, TransactionStatus, TransactionType, MemberTrades } from "./interfaceV2/interfaces";

export interface TransactionColumn {
  id?: string;
  name: string;
  email: string;
  bank: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  "Date Requested": string;
  status: string;
  agentID?: string;
  masteragentID?: string;
}

export interface UserColumn {
  id: string;
  name: string;
  email: string;
  nickname: string;
  password: string;
  accountholder: string;
  accountnumber: string;
  bank: string;
  balance: number;
  agents?: {
    masteragent: {
      memberId: string;
    };
    memberId: string;
  };
  agentID?: string;
  masteragentID?: string;
  status?: boolean;
  lastOnline: Date;
  createdAt: Date;
  force: boolean;
  switchBet: boolean;
  maxBet: boolean;
  phonenumber: string;
}

export interface InquryColumn {
  id: string;
  title: string;
  content: string;
  answer: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
  alreadyAnswered: boolean;
  email: string;
}

export interface OrderHistoryColumnInterface {
  id: string;
  timeExecuted: string;
  trade: string;
  result: string;
  tradeAmount: number;
  tradePNL: number;
  membersId: string;
  type: string;
  name: string;
  email: string;
  nickname: string;
  balance: number;
  remainingBalance: number;
  origTradeAmount: number
}

export type ArrayUserTransaction = {
  withdrawals: UserTransaction[];
  hasMore: boolean;
};

export type ArrayUser = {
  users: Members[];
  hasMore: boolean;
};

export interface ArrayOrderHistory {
  orderHistory: OrderHistory[];
  hasMore: boolean;
}

export interface UserTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  membersId: string;
  createdAt: string;
  updatedAt: string;
  members: Members;
  agentID?: string;
  masteragentID?: string;
}

export interface OrderHistory {
  id: string;
  timeExecuted: string;
  trade: string;
  result: string;
  tradeAmount: number;
  tradePNL: number;
  membersId: string;
  type: string;
  remainingBalance: number;
  origTradeAmount: number
  members: Members;
}

export interface Members {
  id: string;
  email: string;
  role: string;
  name: string;
  password: string;
  confirmpassword: string;
  nickname: string;
  birthdate: string;
  phonenumber: string;
  accountholder: string;
  accountnumber: string;
  bank: string;
  referrer: string;
  balance: number;
  agents: {
    masteragent: {
      memberId: string;
    };
    memberId: string;
  };
  agentID: string;
  agentsId: string;
  masteragentID: string;
  status?: boolean;
  lastOnline: Date;
  createdAt: Date
  force: boolean;
  switchBet: boolean;
  changeTrades: UserTrades;
  maxBet: boolean;
}

export interface AnnouncementInterface {
  title: string;
  content: string;
  dateCreated: Date;
}

export interface MasterAgentInterface {
  name: string;
  email: string;
  password: string;
  nickname: string;
  royalty: number;
}
export interface AgentInterface {
  name: string;
  email: string;
  password: string;
  nickname: string;
  royalty: number;
  masterAgentId: string;
}

export interface ArrayMasterAgent {
  masteragents: Masteragent[];
}

export interface ArrayAgent {
  agents: Agent[];
}

export interface Agent {
  id: string;
  memberId: string;
  royalty: number;
  referralCode: string;
  members: Members[];
  masteragentsId: string;
  member: Member;
}

export interface ArrayInquiry {
  inquries: Inqury[];
  hasMore: boolean;
}

export interface Inqury {
  id: string;
  title: string;
  content: string;
  answer: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
  alreadyAnswered: boolean;
  membersId: any;
  member: Member;
  agentID?: string;
  masterAgentID?: string;
}
export interface Masteragent {
  id: string;
  memberId: string;
  royalty: number;
  referralCode: string | null;
  agents: Agent[];
  member: Member;
}

export interface Member {
  id: string;
  email: string;
  role: string;
  name: string;
  password: string;
  confirmpassword: string;
  nickname: string;
  birthdate: any;
  phonenumber: any;
  accountholder: any;
  accountnumber: any;
  bank: any;
  referrer: any;
  balance: number;
  agentsId: any;
  status?: boolean;
}

export interface SiteSettting {
  site: Site;
}

export interface Site {
  id: string;
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

export type TradesType = MemberTrades

export interface TransactionPayload {
  status: TransactionStatus;
  id: string;
  type: TransactionType;
}

export interface OrderHistoryChangerPayload {
  tradeId: string;
  membersId: string;
  tradeAmount: number;
  balance: number;
  tradePNL: number;
  type: string;
}

export interface InquiryPayload {
  id: string;
  answer: string;
}

export interface SocketListenerPayload {
  newmembers: number;
  inquires: number;
  withdrawals: number;
  deposits: number;
  trades: number;
  online: number
}

export interface TradeLock {
  nasdaq: Stock;
  gold: Stock;
  eurusd: Stock;
  pltr: Stock;
  tsla: Stock;
  nvda: Stock;
}

export interface Stock {
  one_min: N1Min[];
  three_min: N1Min[];
  five_min: N1Min[];
}

export interface N1Min {
  id: string;
  type: MemberTradesType;
  tradinghours: Date;
  result: boolean;
}

export interface OngoingTradeResult {
  [key: string]: Btc1__Min;
}

export interface Btc1__Min {
  totalLong: number;
  totalShort: number;
  totalAmountLong: number;
  totalAmountShort: number;
  result: boolean;
  tradeID: string;
}

export interface UserTrades {
  nasdaq: MemberTrades;
  gold: MemberTrades;
  eurusd: MemberTrades;
  pltr: MemberTrades;
  tsla: MemberTrades;
  nvda: MemberTrades;
}