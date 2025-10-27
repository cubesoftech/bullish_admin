// updateUserTrades
import { NextApiRequest, NextApiResponse } from "next";
import { UserTrades } from "@/utils/interface";
import { prisma } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, trades } = req.body as { id: string, trades: UserTrades }

        await prisma.members.update({
            where: {
                id
            },
            data: {
                nasdaq_trade: trades.nasdaq,
                gold_trade: trades.gold,
                eurusd_trade: trades.eurusd,
                pltr_trade: trades.pltr,
                tsla_trade: trades.tsla,
                nvda_trade: trades.tsla
            }
        })

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error." })
    }
}