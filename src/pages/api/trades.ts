import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { TradeLock } from "@/utils/interface";
import { recenttrades_type } from "@prisma/client";

const btcTrades = async () => {
  const types: recenttrades_type[] = ["btc_1_min", "btc_3_mins", "btc_5_mins"];
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

  const [btc_1_min, btc_3_min, btc_5_min] = await Promise.all(promises);

  return { one_min: btc_1_min, three_min: btc_3_min, five_min: btc_5_min };
};

const oilTrades = async () => {
  const types: recenttrades_type[] = ["wti_1_min", "wti_3_mins", "wti_5_mins"];
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

  const [wti_1_min, wti_3_min, wti_5_min] = await Promise.all(promises);
  return { one_min: wti_1_min, three_min: wti_3_min, five_min: wti_5_min };
};

const goldTrades = async () => {
  const types: recenttrades_type[] = ["gold_1_min", "gold_3_mins", "gold_5_mins"];
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

  const [gold_1_min, gold_3_min, gold_5_min] = await Promise.all(promises);

  return { one_min: gold_1_min, three_min: gold_3_min, five_min: gold_5_min };
};

const us100Trades = async () => {
  const types: recenttrades_type[] = ["us100_1_min", "us100_3_mins", "us100_5_mins"];
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

  const [us100_1_min, us100_3_min, us100_5_min] = await Promise.all(promises);

  return { one_min: us100_1_min, three_min: us100_3_min, five_min: us100_5_min };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TradeLock>
) {

  const [btc, oil, gold, us100] = await Promise.all([
    btcTrades(),
    oilTrades(),
    goldTrades(),
    us100Trades(),
  ]);
  res.status(200).json({
    btc,
    oil,
    gold,
    us100,
  });
}

