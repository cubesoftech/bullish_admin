import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const masteragents = await prisma.masteragents.findMany({
    include: {
      agents: {
        include: {
          referredmembers: true,
        },
      },
    },
  });

  let masteragentwithdetails = [];

  for (let i = 0; i < masteragents.length; i++) {
    const { memberId, agents } = masteragents[i];
    const member = await prisma.members.findFirst({
      where: {
        id: memberId,
      },
    });

    let agentsWithDetails = [];
    for (let j = 0; j < agents.length; j++) {
      const { memberId } = agents[j];
      const member = await prisma.members.findFirst({
        where: {
          id: memberId,
        },
      });
      agentsWithDetails.push({
        ...agents[j],
        member,
      });
    }

    masteragentwithdetails.push({
      ...masteragents[i],
      agents: agentsWithDetails,
      member,
    });
  }

  return res.status(200).json({
    masteragents: masteragentwithdetails,
  });
}
