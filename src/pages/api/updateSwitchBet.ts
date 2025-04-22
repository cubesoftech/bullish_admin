import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, value } = req.body as { id: string, value: boolean }
    try {

        await prisma.members.update({
            where: {
                id
            },
            data: {
                switchBet: value
            }
        })

        const memberWithPendingTrades = await prisma.membertrades.findMany({
            where: {
                membersId: id,
                tradePNL: 0
            }
        })

        if (memberWithPendingTrades.length > 0) {
            await Promise.all(
                memberWithPendingTrades.map(async trades => {
                    const { id, membersId, trade } = trades

                    await prisma.membertrades.update({
                        where: {
                            id
                        },
                        data: {
                            trade: !trade
                        }
                    })
                })
            )
            return res.status(200).json({ message: "ongoing trade updated" })
        }

        return res.status(200).json({ message: "Updated" })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }
}