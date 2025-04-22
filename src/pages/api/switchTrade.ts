import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, value } = req.body as { id: string, value: boolean }

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

        const willDuplicate = await prisma.membertrades.findFirst({
            where: {
                id,
                tradePNL: 0,
                trade: !value
            }
        })

        if (willDuplicate) {
            return res.status(400).json({ message: "Trade already exists." })
        }

        await prisma.membertrades.update({
            where: {
                id
            },
            data: {
                trade: value
            }
        })

        return res.status(200).json({ message: "Trade updated." })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }
}