import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { password, royalty, masterAgentId, membersId } = req.body as {
    password: string;
    royalty: number;
    masterAgentId: string;
    membersId: string;
  };

  await prisma.members.update({
    where: {
      id: membersId,
    },
    data: {
      password,
      confirmpassword: password,
    },
  });

  await prisma.masteragents.update({
    where: {
      id: masterAgentId,
    },
    data: {
      royalty,
    },
  });
  res.status(200).json({
    status: "success",
  });
}
