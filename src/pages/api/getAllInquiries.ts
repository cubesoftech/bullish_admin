import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

type Filter = "all" | "deposit"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = parseInt(req.query.page as string) || 1;
  const { filter } = req.query as { filter: Filter }
  const pageSize = 1000; // Set your page size here

  const getInquiries = async (filter: Filter) => {
    if (filter === "deposit") {
      const inquiries = await prisma.inquiries.findMany({
        where: {
          title: "입금계좌문의"
        },
        orderBy: {
          createdAt: "desc",
        },
        take: pageSize + 1, // Fetch one extra record
        skip: (page - 1) * pageSize,
      });

      return inquiries
    } else {
      const inquiries = await prisma.inquiries.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: pageSize + 1, // Fetch one extra record
        skip: (page - 1) * pageSize,
      });

      return inquiries
    }
  }

  const withdrawals = await getInquiries(filter)

  let inquiriesWithDetails: any = [];
  await Promise.all(withdrawals.map(async (inquiry) => {
    const { memberId } = inquiry;
    let masterAgentID = null;
    let agentID = null;
    const member = await prisma.members.findFirst({
      where: {
        id: memberId,
      },
      include: {
        agents: {
          select: {
            masteragents: {
              select: {
                memberId: true,
              },
            },
            memberId: true,
          },
        },
      },
    });
    if (!member) {
      return;
    }
    if (member) {
      const { agents } = member;
      if (agents) {
        const { masteragents, memberId } = agents;
        const agent = await prisma.members.findFirst({
          where: {
            id: memberId,
          },
        });
        agentID = agent?.email;
        if (masteragents) {
          const { memberId } = masteragents;
          const memberagent = await prisma.members.findFirst({
            where: {
              id: memberId,
            },
          });
          masterAgentID = memberagent?.email;
        }
      }
    }

    inquiriesWithDetails.push({
      ...inquiry,
      member,
      agentID,
      masterAgentID,
    });
  }));
  let hasMore = false;
  if (withdrawals.length > pageSize) {
    hasMore = true;
  }
  res.status(200).json({
    inquries: inquiriesWithDetails.slice(0, pageSize),
    hasMore,
  });
}
