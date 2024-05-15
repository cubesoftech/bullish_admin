import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 1000; // Set your page size here

  const withdrawals = await prisma.inquiries.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1, // Fetch one extra record
    skip: (page - 1) * pageSize,
  });

  let inquiriesWithDetails = [];
  for (let i = 0; i < withdrawals.length; i++) {
    const inquiry = withdrawals[i];
    const { memberId } = inquiry;
    const member = await prisma.members.findFirst({
      where: {
        id: memberId,
      },
    });
    if (!member) {
      continue;
    }
    inquiriesWithDetails.push({
      ...inquiry,
      member,
    });
  }
  let hasMore = false;
  if (withdrawals.length > pageSize) {
    hasMore = true;
  }
  res.status(200).json({
    inquries: inquiriesWithDetails.slice(0, pageSize),
    hasMore,
  });
}
