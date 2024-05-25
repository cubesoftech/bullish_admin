export interface GetIncomeInterface {
  totalOperatorGrossIncome: number;
  totalOperatorNetIncome: number;
  totalAgentGrossIncome: number;
  totalAgentNetIncome: number;
  totalMasterAgentGrossIncome: number;
  totalMasterAgentNetIncome: number;
  withdrawal: number;
  users: User[];
}

export interface User {
  id: string;
  name: string;
  balance: number;
  referrer: string;
  masterAgentID?: string;
  agents: Agents;
  transaction: Transaction[];
  deposit: number;
  withdrawals: number;
  operator_gross_income: number;
  master_agent_gross_income: number;
  agent_gross_income: number;
  operator_net_income: number;
  master_agent_net_income: number;
  agent_net_income: number;
}

export interface Agents {
  masteragents: Masteragents;
  royalty: number;
  memberId: string;
}

export interface Masteragents {
  id: string;
  royalty: number;
}

export interface Transaction {
  amount: number;
  type: string;
}

export interface WithdrawalAgentArray {
  withdrawal: WithdrawalAgent[];
}

export interface WithdrawalAgent {
  id: string;
  amount: number;
  status: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  membersId: string;
  members?: {
    email?: string;
  };
  email?: string;
}
