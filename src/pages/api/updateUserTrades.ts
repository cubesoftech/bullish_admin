// updateUserTrades
import { NextApiRequest, NextApiResponse } from "next";
import { UserTrades } from "@/utils/interface";
import { prisma } from "@/utils";

export default async function handler( req:NextApiRequest, res:NextApiResponse ) {
    try {
        const { id, trades } = req.body as { id: string, trades: UserTrades }

        await prisma.members.update({
            where: {
                id
            },
            data: {
                krw_trade: trades.krw_trade,
                eur_trade: trades.eur_trade,
                jpy_trade: trades.jpy_trade,
            }
        })

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error." })
    }
}