import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const inquiries = await prisma.inquiries.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    inquiries,
  });
}
