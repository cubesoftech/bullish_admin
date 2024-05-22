import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  await prisma.inquiries.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    message: "Delete inquiries successfully",
  });
}
