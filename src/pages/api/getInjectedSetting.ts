import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { inject_setting, transaction_status, transaction_type } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const payload = req.body as inject_setting

    const { id } = payload;

    if (id) {
        const data = await prisma.inject_setting.findFirst({
            where: {
                userId: id,
            }
        });
        if (!data) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found"
            });
        }
        return res.status(200).json({
            status: "success",
            data: data
        });
    }

    //return an error if no id is provided
    return res.status(400).json({
        status: "error",
        message: "No id provided"
    });
}
