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

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error." })
    }
}