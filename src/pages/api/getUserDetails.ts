import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const member = await prisma.members.findFirst({
        where: {
            email: id as string
        },
        select: {
            email: true,
            balance: true,
            id: true
        }
    });
    let recentrades = await prisma.membertrades.findMany({
        where: {
            membersId: member?.id
        }
    });

    let tansactions = await prisma.transaction.findMany({
        where: {
            membersId: member?.id
        }
    });
    return res.status(200).json({ member, recentrades, tansactions });
}