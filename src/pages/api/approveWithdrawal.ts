import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body as {
    id: string;
  };

  await prisma.agents_withdrawals.update({
    where: {
      id: id,
    },
    data: {
      status: "completed",
    },
  });
  res.status(200).json({
    status: "success",
  });
}
