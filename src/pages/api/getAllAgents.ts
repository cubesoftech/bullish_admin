import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { masteragentsId } = req.query;
  if (!masteragentsId || typeof masteragentsId !== "string") {
    return res.status(400).json({
      message: "Master agents id is required",
    });
  }
  const agents = await prisma.agents.findMany({
    where: {
      masteragentsId,
    },
  });

  let agentsWithDetails = [];

  for (let i = 0; i < agents.length; i++) {
    const { memberId } = agents[i];
    const member = await prisma.members.findFirst({
      where: {
        id: memberId,
      },
    });
    agentsWithDetails.push({
      ...agents[i],
      member,
    });
  }

  return res.status(200).json({
    agents: agentsWithDetails,
  });
}
