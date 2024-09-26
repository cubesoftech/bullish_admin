import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import _ from "lodash";
import { recenttrades_type } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const allPendingTrades = await prisma.membertrades.findMany({
        where: {
            tradePNL: 0
        },
        orderBy: {
            type: "asc"
        }
    });
    const grouped = _.groupBy(allPendingTrades, "type");
    const newGrouped: any = {};
    //grouped again the data by the trade type { totallong, totalshort, totalAmountLong, totalAmountShort }

    const promises = Object.keys(grouped).map(async (key: string | recenttrades_type) => {
        const result = await prisma.recenttrades.findFirst({
            where: {
                tradinghours: {
                    // greater than current time
                    gte: new Date(),
                },
                type: key as recenttrades_type
            },
            orderBy: {
                tradinghours: "asc",
            },
        })
        let totalLong = 0;
        let totalShort = 0;
        let totalAmountLong = 0;
        let totalAmountShort = 0;
        grouped[key].map((trade) => {
            if (trade.trade) {
                totalLong++;
                totalAmountLong += trade.tradeAmount;
            } else {
                totalShort++;
                totalAmountShort += trade.tradeAmount;
            }
        });
        return {
            key,
            result: Boolean(result?.result),
            tradeID: result?.id,
            totalLong,
            totalShort,
            totalAmountLong,
            totalAmountShort,
        };
    });

    const results = await Promise.all(promises);

    results.forEach(({ key, totalLong, totalShort, totalAmountLong, totalAmountShort, result, tradeID }) => {
        newGrouped[key] = {
            totalLong,
            totalShort,
            totalAmountLong,
            totalAmountShort,
            result,
            tradeID
        };
    });
    res.status(200).json(newGrouped);
}
