import {
  recenttrades_type,
  transaction_status,
  transaction_type,
} from "@prisma/client";

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
  lastOnline: Date
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
  masteragentID: string;
  status?: boolean;
  lastOnline: Date;
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
  referredmembers: Members[];
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
  btc: boolean;
  wti: boolean;
  nasdaq: boolean;
  gold: boolean;
  minimumAmount: number;
}

export interface TransactionPayload {
  status: transaction_status;
  id: string;
  type: transaction_type;
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
}

export interface TradeLock {
  btc: Stock;
  oil: Stock;
  gold: Stock;
  us100: Stock;
}

export interface Stock {
  one_min: N1Min[];
  three_min: N1Min[];
  five_min: N1Min[];
}

export interface N1Min {
  id: string;
  type: recenttrades_type;
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
}
