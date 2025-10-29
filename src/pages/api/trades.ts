import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { TradeLock } from "@/utils/interface";
import { recenttrades_type } from "@prisma/client";

const nasdaqTrades = async () => {
  const types: recenttrades_type[] = ["nasdaq_1_min", "nasdaq_3_mins", "nasdaq_5_mins"];
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

  const [nasdaq_1_min, nasdaq_3_mins, nasdaq_5_mins] = await Promise.all(promises);
  return { one_min: nasdaq_1_min, three_min: nasdaq_3_mins, five_min: nasdaq_5_mins };
}

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

  const [gold_1_min, gold_3_mins, gold_5_mins] = await Promise.all(promises);
  return { one_min: gold_1_min, three_min: gold_3_mins, five_min: gold_5_mins };
}

const eurusdTrades = async () => {
  const types: recenttrades_type[] = ["eurusd_1_min", "eurusd_3_mins", "eurusd_5_mins"];
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

  const [eurusd_1_min, eurusd_3_mins, eurusd_5_mins] = await Promise.all(promises);
  return { one_min: eurusd_1_min, three_min: eurusd_3_mins, five_min: eurusd_5_mins };
}

const pltrTrades = async () => {
  const types: recenttrades_type[] = ["pltr_1_min", "pltr_3_mins", "pltr_5_mins"];
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

  const [pltr_1_min, pltr_3_mins, pltr_5_mins] = await Promise.all(promises);
  return { one_min: pltr_1_min, three_min: pltr_3_mins, five_min: pltr_5_mins };
}

const tslaTrades = async () => {
  const types: recenttrades_type[] = ["tsla_1_min", "tsla_3_mins", "tsla_5_mins"];
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

  const [tsla_1_min, tsla_3_mins, tsla_5_mins] = await Promise.all(promises);
  return { one_min: tsla_1_min, three_min: tsla_3_mins, five_min: tsla_5_mins };
}

const nvdaTrades = async () => {
  const types: recenttrades_type[] = ["nvda_1_min", "nvda_3_mins", "nvda_5_mins"];
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

  const [nvda_1_min, nvda_3_mins, nvda_5_mins] = await Promise.all(promises);
  return { one_min: nvda_1_min, three_min: nvda_3_mins, five_min: nvda_5_mins };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TradeLock>
) {

  const [nasdaq, gold, eurusd, pltr, tsla, nvda] = await Promise.all([
    nasdaqTrades(),
    goldTrades(),
    eurusdTrades(),
    pltrTrades(),
    tslaTrades(),
    nvdaTrades(),
  ]);

  res.status(200).json({
    nasdaq,
    gold,
    eurusd,
    pltr,
    tsla,
    nvda
  });
}

