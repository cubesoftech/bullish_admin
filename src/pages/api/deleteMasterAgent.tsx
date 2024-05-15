import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body as { id: string };
  const masteragent = await prisma.masteragents.delete({
    where: {
      id: id,
    },
  });
  const { memberId } = masteragent;
  await prisma.members.delete({
    where: {
      id: memberId,
    },
  });

  res.status(200).json({
    message: "Delete announcement successfully",
  });
}
