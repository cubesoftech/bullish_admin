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
}

export interface OrderHistoryColumn {
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
}
