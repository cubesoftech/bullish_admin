import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { tradeID, membersId, newAmount } = req.body as { tradeID: string, membersId: string, newAmount: number }

        // get minimum allowed trade amount
        const gameSetting = await prisma.sitesettings.findFirst()

        if (gameSetting && gameSetting.minimumAmount > newAmount) {
            return res.status(400).json({ message: `New trade amount must be bigger than ${gameSetting.minimumAmount}` })
        }
        // update the trade amount
        const trade = await prisma.membertrades.findFirst({
            where: {
                id: tradeID,
                membersId: membersId,
                tradePNL: 0
            }
        })

        if (!trade) {
            return res.status(400).json({ message: "Trade not found." })
        }

        const { origTradeAmount, tradeAmount, remainingBalance } = trade

        if (origTradeAmount && tradeAmount && remainingBalance) {
            if (newAmount < origTradeAmount || newAmount < tradeAmount) {
                await prisma.membertrades.update({
                    where: {
                        id: tradeID,
                        membersId: membersId,
                        tradePNL: 0
                    },
                    data: {
                        origTradeAmount: newAmount,
                        tradeAmount: newAmount,
                        remainingBalance: {
                            increment: (origTradeAmount - newAmount)
                        }
                    }
                })
                await prisma.members.update({
                    where: {
                        id: membersId
                    },
                    data: {
                        balance: {
                            increment: (origTradeAmount - newAmount)
                        }
                    }
                })
            } else {
                await prisma.membertrades.update({
                    where: {
                        id: tradeID,
                        membersId: membersId,
                        tradePNL: 0
                    },
                    data: {
                        origTradeAmount: newAmount,
                        tradeAmount: newAmount,
                        remainingBalance: {
                            decrement: (newAmount - origTradeAmount)
                        }
                    }
                })
                await prisma.members.update({
                    where: {
                        id: membersId
                    },
                    data: {
                        balance: {
                            decrement: (newAmount - origTradeAmount)
                        }
                    }
                })
            }
            return res.status(200).json({ message: "Trade updated" })
        }
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }
}