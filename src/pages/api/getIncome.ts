import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

const get_all_transaction = async () => {
  const transaction = await prisma.members.findMany({
    where: {
      role: "USER",
    },
    include: {
      transaction: {
        where: {
          status: "completed",
        },
      },
    },
  });

  const modifiedTransaction = transaction.map(async (e) => {
    const { transaction } = e;
    let deposit = 0;
    let withdrawals = 0;
    transaction.map((g) => {
      const { type } = g;
      if (type === "deposit") deposit += g.amount;
      if (type === "withdrawal") withdrawals += g.amount;
    });
    return { ...e, deposit, withdrawals };
  });
  return modifiedTransaction;
};

const get_all_transaction2 = async (month: number) => {
  //if month is 1, it means January 12 means December
  const users = await prisma.members.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      balance: true,
      referrer: true,
      agents: {
        select: {
          masteragents: {
            select: {
              id: true,
              royalty: true,
            },
          },
          royalty: true,
          memberId: true,
        },
      },
      // other fields you need
      transaction: {
        select: {
          amount: true,
          type: true,
        },
        where: {
          status: "completed",
          type: "deposit",
          createdAt: {
            gte: new Date(new Date().getFullYear(), month - 1, 1),
            lt: new Date(new Date().getFullYear(), month, 1),
          },
        },
      },
    },
  });

  const modifiedUsers = users.map((user) => {
    const deposit = user.transaction.reduce((sum, transaction) => {
      if (transaction.type === "deposit") {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);
    const withdrawals = user.transaction.reduce((sum, transaction) => {
      if (transaction.type === "withdrawal") {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);
    return { ...user, deposit, withdrawals };
  });
  const modifiedUsers2 = modifiedUsers.map((user) => {
    const operator_gross_income =
      user.deposit - user.withdrawals + (user?.balance || 0);
    const master_agent_gross_income =
      (operator_gross_income * (user.agents?.masteragents?.royalty || 0)) / 100;
    const agent_gross_income =
      (operator_gross_income * (user.agents?.royalty || 0)) / 100;
    const operator_net_income =
      operator_gross_income - master_agent_gross_income;
    const master_agent_net_income =
      master_agent_gross_income - agent_gross_income;
    const agent_net_income = agent_gross_income;
    return {
      ...user,
      operator_gross_income,
      master_agent_gross_income,
      agent_gross_income,
      operator_net_income,
      master_agent_net_income,
      agent_net_income,
    };
  });

  const totalOperatorGrossIncome = modifiedUsers2.reduce(
    (sum, user) => sum + user.operator_gross_income,
    0
  );
  const totalOperatorNetIncome = modifiedUsers2.reduce(
    (sum, user) => sum + user.operator_net_income,
    0
  );
  const totalAgentGrossIncome = modifiedUsers2.reduce(
    (sum, user) => sum + user.agent_gross_income,
    0
  );
  const totalAgentNetIncome = modifiedUsers2.reduce(
    (sum, user) => sum + user.agent_net_income,
    0
  );
  const totalMasterAgentGrossIncome = modifiedUsers2.reduce(
    (sum, user) => sum + user.master_agent_gross_income,
    0
  );
  const totalMasterAgentNetIncome = modifiedUsers2.reduce(
    (sum, user) => sum + user.master_agent_net_income,
    0
  );
  return {
    totalOperatorGrossIncome,
    totalOperatorNetIncome,
    totalAgentGrossIncome,
    totalAgentNetIncome,
    totalMasterAgentGrossIncome,
    totalMasterAgentNetIncome,
    users: modifiedUsers2,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const all = await get_all_transaction2(5);
  return res.status(200).json(all);
}
