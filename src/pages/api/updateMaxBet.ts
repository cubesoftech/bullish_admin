import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, value } = req.body as { id: string, value: boolean }

        await prisma.members.update({
            where: {
                id
            },
            data: {
                maxBet: value
            }
        })

        const pendingTrades = await prisma.membertrades.findMany({
            where: {
                membersId: id,
                tradePNL: 0
            }
        })

        if (pendingTrades.length > 0) {
            await Promise.all(
                pendingTrades.map(async trade => {
                    const { id, membersId, tradeAmount, remainingBalance, origTradeAmount } = trade

                    // check if there are othher trades
                    const otherTrades = await prisma.membertrades.findMany({
                        where: {
                            membersId,
                            tradePNL: 0
                        }
                    })

                    // get the info of trader
                    const member = await prisma.members.findFirst({
                        where: {
                            id: membersId
                        }
                    })

                    let balance = member?.balance || 0

                    if (trade && balance >= 0 && remainingBalance && origTradeAmount) {
                        await prisma.membertrades.update({
                            where: {
                                id
                            },
                            data: {
                                tradeAmount: value
                                    ? balance / otherTrades.length
                                    : origTradeAmount
                            }
                        })

                        await prisma.members.update({
                            where: {
                                id: membersId
                            },
                            data: {
                                balance: value ? 0 : remainingBalance
                            }
                        })
                    }
                })
            )
            return res.status(200).json({ message: "ongoing trade updated" })
        }
        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error." })
    }
}