import { prisma } from '@/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const depositCount = await prisma.transaction.count({
        where: {
            type: "deposit",
            status: "pending"
        }
    })
    const withdrawalCount = await prisma.transaction.count({
        where: {
            type: "withdrawal",
            status: "pending"
        }
    })
    const inquiryCount = await prisma.inquiries.count({
        where: {
            alreadyAnswered: false
        }
    })
    return res.status(200).json({ depositCount, withdrawalCount, inquiryCount })
}