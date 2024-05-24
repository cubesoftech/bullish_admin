import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { Role } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 1000; // Set your page size here
  const role = req.query.role as Role;
  const id = req.query.id as string;

  if (role === "AGENT") {
    const agents = await prisma.agents.findFirst({
      where: {
        memberId: id,
      },
    });
    if (!agents) {
      return res.status(200).json({
        users: [],
        hasMore: false,
      });
    }
    const { id: AgentId } = agents;
    const users = await prisma.members.findMany({
      where: {
        role: "USER",
        agentsId: AgentId,
      },
      take: pageSize + 1, // Fetch one extra record
      skip: (page - 1) * pageSize,
    });
    let hasMore = false;
    if (users.length > pageSize) {
      hasMore = true;
    }
    return res.status(200).json({
      users: users.slice(0, pageSize),
      hasMore,
    });
  }

  if (role === "MASTER_AGENT") {
    const masteragents = await prisma.masteragents.findFirst({
      where: {
        memberId: id,
      },
    });
    if (!masteragents) {
      return res.status(200).json({
        users: [],
        hasMore: false,
      });
    }
    const { id: masterAgent } = masteragents;

    const users = await prisma.members.findMany({
      where: {
        role: "USER",
        agents: {
          masteragentsId: masterAgent,
        },
      },
      take: pageSize + 1, // Fetch one extra record
      skip: (page - 1) * pageSize,
    });
    let hasMore = false;
    if (users.length > pageSize) {
      hasMore = true;
    }
    return res.status(200).json({
      users: users.slice(0, pageSize),
      hasMore,
    });
  }
  const users = await prisma.members.findMany({
    where: {
      role: "USER",
    },
    take: pageSize + 1, // Fetch one extra record
    skip: (page - 1) * pageSize,
  });
  let hasMore = false;
  if (users.length > pageSize) {
    hasMore = true;
  }
  res.status(200).json({
    users: users.slice(0, pageSize),
    hasMore,
  });
}
