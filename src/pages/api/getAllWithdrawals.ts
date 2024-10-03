import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 1000; // Set your page size here
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  const startDate_ = new Date(startDate);
  const endDate_ = new Date(endDate);

  const withdrawals = await prisma.transaction.findMany({
    where: {
      type: "withdrawal",
      createdAt: {
        gte: startDate_,
        lte: endDate_,
      },
    },
    include: {
      members: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1, // Fetch one extra record
    skip: (page - 1) * pageSize,
  });
  const withdrawalsModifiedPromises = withdrawals.map(async (withdrawal) => {
    const { members } = withdrawal;
    const { agentsId } = members;
    let agentID: undefined | string = undefined;
    let masteragentID: undefined | string = undefined;
    if (agentsId) {
      const agent = await prisma.agents.findFirst({
        where: {
          id: agentsId,
        },
      });
      const agentMember = await prisma.members.findFirst({
        where: {
          id: agent?.memberId,
        },
      });
      agentID = agentMember?.email;
      if (agent?.masteragentsId) {
        const masteragentMember = await prisma.members.findFirst({
          where: {
            id: agent.masteragentsId,
          },
        });
        masteragentID = masteragentMember?.email;
      }
    }
    return {
      ...withdrawal,
      agentID,
      masteragentID,
    };
  });
  const withdrawalsModified = await Promise.all(withdrawalsModifiedPromises);
  let hasMore = false;
  if (withdrawals.length > pageSize) {
    hasMore = true;
  }
  res.status(200).json({
    withdrawals: withdrawalsModified.slice(0, pageSize),
    hasMore,
  });
}
