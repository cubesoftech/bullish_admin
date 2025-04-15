import { prisma } from '@/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const depositCountPromise = prisma.transaction.count({
        where: {
            type: "deposit",
            status: "pending"
        }
    })
    const withdrawalCountPromise = prisma.transaction.count({
        where: {
            type: "withdrawal",
            status: "pending"
        }
    })
    const inquiryCountPromise = prisma.inquiries.count({
        where: {
            alreadyAnswered: false
        }
    })
    const depositInquiryPromise = prisma.inquiries.count({
        where: {
            alreadyAnswered: false,
            title: "입금계좌문의"
        }
    })

    const promise = [depositCountPromise, withdrawalCountPromise, inquiryCountPromise, depositInquiryPromise]
    const [depositCount, withdrawalCount, inquiryCount, depositInquiryCount] = await Promise.all(promise)
    return res.status(200).json({ depositCount, withdrawalCount, inquiryCount, depositInquiryCount })
}