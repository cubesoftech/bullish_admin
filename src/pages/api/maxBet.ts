import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, memberId, value } = req.body as { id: string, memberId: string, value: boolean }

    console.log(value)

    try {
        const trade = await prisma.membertrades.findFirst({
            where: {
                id,
                tradePNL: 0
            }
        })

        if (!trade) {
            return res.status(404).json({ message: "Trade not found." })
        }

        const member = await prisma.members.findFirst({
            where: {
                id: memberId
            }
        })

        if (!member) {
            return res.status(404).json({ message: "User not found." })
        }

        let balance = member?.balance || 0

        const gameSetting = await prisma.sitesettings.findFirst()

        let lowestBet = gameSetting?.minimumAmount || 0

        if (value && balance <= lowestBet) {
            return res.status(400).json({ message: "Not enough asset." })
        }

        if (trade && trade.origTradeAmount && trade.remainingBalance && balance >= 0) {
            console.log(member, trade)
            const { origTradeAmount, remainingBalance, tradeAmount } = trade
            await prisma.membertrades.update({
                where: {
                    id
                },
                data: {
                    tradeAmount: value ? balance + tradeAmount : origTradeAmount
                }
            })
            await prisma.members.update({
                where: {
                    id: memberId
                },
                data: {
                    balance: value ? 0 : remainingBalance
                }
            })
            return res.status(200).json({ message: "Trade updated." })
        }

        return res.status(200).json({ message: "Trade updated." })

    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error." })
    }
}