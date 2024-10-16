import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 50; // Set your page size here
  const role = req.query.role as "ADMIN" | "AGENT" | "MASTER_AGENT";
  const id = req.query.id as string;


  if (role === "MASTER_AGENT") {
    //get all agents under this master agent
    const masteragent = await prisma.masteragents.findFirst({
      where: {
        memberId: id,
      },
    });
    if (!masteragent) {
      return res.status(200).json({
        orderHistory: [],
        hasMore: false,
      });
    }
    const allAgents = await prisma.agents.findMany({
      where: {
        masteragentsId: masteragent.id,
      },
    });
    const referralCodes = allAgents.map((agent) => agent.referralCode);

    const orderHistory = await prisma.membertrades.findMany({
      where: {
        members: {
          referrer: {
            in: referralCodes,
          },
        },
      },
      include: {
        members: true,
      },
      orderBy: {
        timeExecuted: "desc",
      },
      take: pageSize + 1, // Fetch one extra record
      skip: (page - 1) * pageSize,
    });

    let hasMore = false;
    if (orderHistory.length > pageSize) {
      hasMore = true;
    }
    return res.status(200).json({
      orderHistory: orderHistory.slice(0, pageSize),
      hasMore,
    });
  }

  if (role === "AGENT") {
    const agent = await prisma.agents.findFirst({
      where: {
        memberId: id,
      },
    });
    if (!agent) {
      return res.status(200).json({
        orderHistory: [],
        hasMore: false,
      });
    }
    const orderHistory = await prisma.membertrades.findMany({
      where: {
        members: {
          referrer: agent.referralCode,
        },
      },
      include: {
        members: true,
      },
      orderBy: {
        timeExecuted: "desc",
      },
      take: pageSize + 1, // Fetch one extra record
      skip: (page - 1) * pageSize,
    });
    let hasMore = false;
    if (orderHistory.length > pageSize) {
      hasMore = true;
    }
    return res.status(200).json({
      orderHistory: orderHistory.slice(0, pageSize),
      hasMore,
    });
  }

  const orderHistory = await prisma.membertrades.findMany({
    include: {
      members: true,
    },
    orderBy: {
      timeExecuted: "desc",
    },
    take: pageSize + 1, // Fetch one extra record
    skip: (page - 1) * pageSize,
  });
  let hasMore = false;
  if (orderHistory.length > pageSize) {
    hasMore = true;
  }
  res.status(200).json({
    orderHistory: orderHistory.slice(0, pageSize),
    hasMore,
  });
}
