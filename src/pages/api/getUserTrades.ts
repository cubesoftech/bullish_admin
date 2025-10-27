import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { UserTrades } from "@/utils/interface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body as { id: string }

    const user = await prisma.members.findFirst({
        where: {
            id
        }
    })

    return res.status(200).json({
        data: {
            nasdaq: user?.nasdaq_trade,
            gold: user?.gold_trade,
            eurusd: user?.eurusd_trade,
            pltr: user?.pltr_trade,
            tsla: user?.tsla_trade,
            nvda: user?.nvda_trade,
        }
    })
}