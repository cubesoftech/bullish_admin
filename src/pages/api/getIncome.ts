import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

const get_all_transaction2 = async (month: number) => {
  //if month is 1, it means January 12 means December
  const users_ = await prisma.members.findMany({
    where: {
      role: "USER",
      email: {
        not: {
          contains: "test",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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
              memberId: true,
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
          createdAt: true,
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

  //retrive email of master agent
  const usersModified = users_.map(async (user) => {
    let masterAgentID: string | null = null;
    const masteragentid = user.agents?.masteragents?.memberId || "";
    const memberMAsterAgent = await prisma.members.findFirst({
      where: {
        id: masteragentid,
      },
    });
    if (memberMAsterAgent) {
      masterAgentID = memberMAsterAgent.email;
    }
    return { ...user, masterAgentID };
  });

  const users = await Promise.all(usersModified);

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
    const userBalance =
      user?.withdrawals === 0 && user?.deposit === 0 ? 0 : user?.balance || 0;
    const operator_gross_income =
      user.deposit - (user.withdrawals + (userBalance || 0));
    console.log(operator_gross_income);
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

  const {
    totalOperatorGrossIncome,
    totalOperatorNetIncome,
    totalAgentGrossIncome,
    totalAgentNetIncome,
    totalMasterAgentGrossIncome,
    totalMasterAgentNetIncome,
  } = totality();
  return {
    totalOperatorGrossIncome,
    totalOperatorNetIncome,
    totalAgentGrossIncome,
    totalAgentNetIncome,
    totalMasterAgentGrossIncome,
    totalMasterAgentNetIncome,
    users: modifiedUsers2,
  };

  function totality() {
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
    };
  }
};

const get_all_transaction2_master = async (month: number, id: string) => {
  const masterAgent = await prisma.masteragents.findFirst({
    where: {
      memberId: id,
    },
  });

  const withdrawal = await prisma.agents_withdrawals.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      membersId: id,
      status: "completed",
    },
  });

  if (!masterAgent) {
    return {
      totalOperatorGrossIncome: 0,
      totalOperatorNetIncome: 0,
      totalAgentGrossIncome: 0,
      totalAgentNetIncome: 0,
      totalMasterAgentGrossIncome: 0,
      totalMasterAgentNetIncome: 0,
      users: [],
    };
  }
  const { id: MasteragentId } = masterAgent;
  let allUsers = await get_all_transaction2(month);
  const masterAgents = allUsers.users.filter((user) => {
    const { agents } = user;
    return agents?.masteragents?.id === MasteragentId;
  });

  const withdrawalAmount = withdrawal._sum.amount || 0;

  allUsers.totalMasterAgentGrossIncome = masterAgents.reduce(
    (sum, user) => sum + user.master_agent_gross_income,
    0
  );
  allUsers.totalMasterAgentNetIncome = masterAgents.reduce(
    (sum, user) => sum + user.master_agent_net_income,
    0
  );
  allUsers.totalOperatorGrossIncome = masterAgents.reduce(
    (sum, user) => sum + user.operator_gross_income,
    0
  );
  allUsers.totalOperatorNetIncome = masterAgents.reduce(
    (sum, user) => sum + user.operator_net_income,
    0
  );
  allUsers.totalAgentGrossIncome = masterAgents.reduce(
    (sum, user) => sum + user.agent_gross_income,
    0
  );
  allUsers.totalAgentNetIncome = masterAgents.reduce(
    (sum, user) => sum + user.agent_net_income,
    0
  );
  allUsers.users = masterAgents;

  allUsers.totalMasterAgentNetIncome -= withdrawalAmount;
  return { ...allUsers, withdrawal: withdrawal._sum.amount || 0 };
};

const get_all_transaction2_agent = async (month: number, id: string) => {
  const withdrawal = await prisma.agents_withdrawals.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      membersId: id,
      status: "completed",
    },
  });

  let allUsers = await get_all_transaction2(month);
  const masterAgents = allUsers.users.filter((user) => {
    const { agents } = user;
    return agents?.memberId === id;
  });

  const withdrawalAmount = withdrawal._sum.amount || 0;

  allUsers.totalMasterAgentGrossIncome = masterAgents.reduce(
    (sum, user) => sum + user.master_agent_gross_income,
    0
  );
  allUsers.totalMasterAgentNetIncome = masterAgents.reduce(
    (sum, user) => sum + user.master_agent_net_income,
    0
  );
  allUsers.totalOperatorGrossIncome = masterAgents.reduce(
    (sum, user) => sum + user.operator_gross_income,
    0
  );
  allUsers.totalOperatorNetIncome = masterAgents.reduce(
    (sum, user) => sum + user.operator_net_income,
    0
  );
  allUsers.totalAgentGrossIncome = masterAgents.reduce(
    (sum, user) => sum + user.agent_gross_income,
    0
  );
  allUsers.totalAgentNetIncome = masterAgents.reduce(
    (sum, user) => sum + user.agent_net_income,
    0
  );
  allUsers.users = masterAgents;

  allUsers.totalAgentNetIncome -= withdrawalAmount;
  return { ...allUsers, withdrawal: withdrawal._sum.amount || 0 };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { month, role, id } = req.query as any as {
    month: number;
    role: "ADMIN" | "AGENT" | "MASTER_AGENT";
    id: string;
  };

  if (role && id) {
    if (role === "MASTER_AGENT") {
      const memberUser = await prisma.members.findFirst({
        where: {
          id: id,
        },
      });
      if (!memberUser) {
        return res.status(500).json({ status: "Error" });
      }
      const user = await get_all_transaction2_master(Number(month), id);
      const correctedUser = user.users.map((e, index) => {
        const { masterAgentID } = e;
        if (masterAgentID === memberUser.email) {
          user.totalMasterAgentNetIncome += e.agent_net_income;
          user.totalAgentGrossIncome -= e.agent_net_income;
          user.totalAgentNetIncome -= e.agent_gross_income;

          user.users[index].agent_gross_income = 0;
          user.users[index].agent_net_income = 0;
        }
      });
      return res.status(200).json(user);
    }
    if (role === "AGENT") {
      const user = await get_all_transaction2_agent(Number(month), id);
      return res.status(200).json(user);
    }
  }
  const monthtoday = new Date().getMonth() + 1;
  const all = await get_all_transaction2(Number(month) || monthtoday);
  all.users.map((e, index) => {
    const { referrer, masterAgentID } = e;
    if (referrer === masterAgentID) {
      all.totalMasterAgentNetIncome += e.agent_net_income;
      all.totalAgentGrossIncome -= e.agent_net_income;
      all.totalAgentNetIncome -= e.agent_gross_income;
      all.users[index].agent_gross_income = 0;
      all.users[index].agent_net_income = 0;
      all.users[index].master_agent_net_income += e.agent_net_income;
    }
  });
  return res.status(200).json(all);
}
