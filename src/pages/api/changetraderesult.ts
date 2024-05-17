import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const inquiry = req.body as { result: boolean; id: string };
  const { result, id } = inquiry;
  await prisma.recenttrades.update({
    where: {
      id,
    },
    data: {
      result: result,
    },
  });
  res.status(200).json({
    status: "success",
  });
}
