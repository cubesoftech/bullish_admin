import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { TradeLock } from "@/utils/interface";
import { recenttrades_type } from "@prisma/client";

const usdkrwTrades = async () => {
  const types: recenttrades_type[] = ["usdkrw_1_min", "usdkrw_2_mins", "usdkrw_5_mins"];
  const promises = types.map(type =>
    prisma.recenttrades.findMany({
      where: {
        tradinghours: {
          // greater than current time
          gte: new Date(),
        },
        type
      },
      take: 50,
      orderBy: {
        tradinghours: "asc",
      },
    })
  );

  const [usdkrw_1_min, usdkrw_2_min, usdkrw_5_min] = await Promise.all(promises);

  return { one_min: usdkrw_1_min, two_min: usdkrw_2_min, five_min: usdkrw_5_min };
}
const eurusdTrades = async () => {
  const types: recenttrades_type[] = ["eurusd_1_min", "eurusd_2_mins", "eurusd_5_mins"];
  const promises = types.map(type =>
    prisma.recenttrades.findMany({
      where: {
        tradinghours: {
          // greater than current time
          gte: new Date(),
        },
        type
      },
      take: 50,
      orderBy: {
        tradinghours: "asc",
      },
    })
  );

  const [eurusd_1_min, eurusd_2_min, eurusd_5_min] = await Promise.all(promises);

  return { one_min: eurusd_1_min, two_min: eurusd_2_min, five_min: eurusd_5_min };
}
const jpyusdTrades = async () => {
  const types: recenttrades_type[] = ["jpyusd_1_min", "jpyusd_2_mins", "jpyusd_5_mins"];
  const promises = types.map(type =>
    prisma.recenttrades.findMany({
      where: {
        tradinghours: {
          // greater than current time
          gte: new Date(),
        },
        type
      },
      take: 50,
      orderBy: {
        tradinghours: "asc",
      },
    })
  );

  const [jpyusd_1_min, jpyusd_2_min, jpyusd_5_mins] = await Promise.all(promises);

  return { one_min: jpyusd_1_min, two_min: jpyusd_2_min, five_min: jpyusd_5_mins };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TradeLock>
) {

  const [krw, eur, jpy] = await Promise.all([
    usdkrwTrades(),
    eurusdTrades(),
    jpyusdTrades(),
  ]);

  res.status(200).json({
    krw,
    eur,
    jpy
  });
}

