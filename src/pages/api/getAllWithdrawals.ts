import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 1000; // Set your page size here

    const withdrawals = await prisma.transaction.findMany({
        where: {
            type: "withdrawal",
        },
        include: {
            members: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: pageSize + 1, // Fetch one extra record
        skip: (page - 1) * pageSize,
    });
    let hasMore = false;
    if (withdrawals.length > pageSize) {
        hasMore = true;
    }
    res.status(200).json({
        withdrawals: withdrawals.slice(0, pageSize),
        hasMore,
    });
}
