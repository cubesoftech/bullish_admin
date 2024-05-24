import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bulkId } = req.body as { bulkId: string[] };
  await prisma.transaction.deleteMany({
    where: {
      id: {
        in: bulkId,
      },
    },
  });
  res.status(200).json({
    message: "Delete announcement successfully",
  });
}
