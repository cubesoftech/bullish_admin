import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler( req:NextApiRequest, res:NextApiResponse ) {
    const { id, value }  = req.body as { id:string, value:boolean }
    try {
        await prisma.members.update({
            where: {
                id
            },
            data: {
                switchBet: value
            }
        })
        return res.status(200).json({ message: "Updated" })
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }
}