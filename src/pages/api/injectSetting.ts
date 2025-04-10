import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { inject_setting, transaction_status, transaction_type } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const payload = req.body as inject_setting

    console.log("payload: ", payload)

    const { id } = payload;

    if (id) {
        await prisma.inject_setting.update({
            where: {
                id: id,
            },
            data: {
                ...payload
            }
        });
        return res.status(200).json({
            status: "success",
        });
    }

    await prisma.inject_setting.create({
        data: {
            ...payload,
            id: Math.random().toString(36).substring(7)
        }
    });
    return res.status(200).json({
        status: "success",
    });
}
