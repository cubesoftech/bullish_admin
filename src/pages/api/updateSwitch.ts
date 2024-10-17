import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { force, id } = req.body as { id: string, force: boolean };

    await prisma.members.update({
        where: {
            id: id,
        },
        data: {
            force
        }
    });

    res.status(200).json({
        status: true
    });
}
