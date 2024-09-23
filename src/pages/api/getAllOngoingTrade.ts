import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import _ from "lodash";

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
    Object.keys(grouped).map((key) => {
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
        newGrouped[key] = {
            totalLong,
            totalShort,
            totalAmountLong,
            totalAmountShort,
        };
    });
    res.status(200).json(newGrouped);
}
