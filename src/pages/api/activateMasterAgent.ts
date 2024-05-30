import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, status } = req.body as {
    id: string;
    status: boolean;
  };

  await prisma.members.update({
    where: {
      id: id,
    },
    data: {
      status,
    },
  });
  res.status(200).json({
    status: "success",
  });
}
