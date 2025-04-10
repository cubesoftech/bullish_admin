import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { UserTrades } from "@/utils/interface";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const { id } = req.body as { id:string }

    const user = await prisma.members.findFirst({
        where: {
            id
        }
    })
    
    return res.status(200).json({ data: { krw_trade: user?.krw_trade, eur_trade: user?.eur_trade, jpy_trade: user?.jpy_trade }  })
}