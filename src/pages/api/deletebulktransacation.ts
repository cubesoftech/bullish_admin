import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bulkId } = req.body as { bulkId: string[] };
  console.log("bulkId", bulkId)
  await prisma.transaction.deleteMany({
    where: {
      id: {
        in: bulkId,
      },
    },
  })
    .catch((error) => {
      console.error(error, "delete transaction failed");
      res.status(500).json({
        message: "Delete transaction failed",
      });
    })
    .then(e => {
      console.log("delete transaction successfully", e)
    })
  res.status(200).json({
    message: "Delete announcement successfully",
  });
}
