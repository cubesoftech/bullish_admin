import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { TradeLock } from "@/utils/interface";

const btcTrades = async () => {
  const btc_1_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "btc_1_min",
    },
    take: 100,
    orderBy: {
      tradinghours: "asc",
    },
  });
  const btc_3_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "btc_3_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "asc",
    },
  });
  const btc_5_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "btc_5_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "asc",
    },
  });
  return { one_min: btc_1_min, three_min: btc_3_min, five_min: btc_5_min };
};

const oilTrades = async () => {
  const wti_1_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "wti_1_min",
    },
    take: 100,
    orderBy: {
      tradinghours: "asc",
    },
  });

  const wti_3_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "wti_3_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  const wti_5_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "wti_5_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  return { one_min: wti_1_min, three_min: wti_3_min, five_min: wti_5_min };
};

const goldTrades = async () => {
  const gold_1_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "gold_1_min",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  const gold_3_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "gold_3_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  const gold_5_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "gold_5_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  return { one_min: gold_1_min, three_min: gold_3_min, five_min: gold_5_min };
};

const us100Trades = async () => {
  const us100_1_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "us100_1_min",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  const us100_3_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "us100_3_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  const us100_5_min = await prisma.recenttrades.findMany({
    where: {
      tradinghours: {
        //greater then current tiime
        gte: new Date(),
      },
      type: "us100_5_mins",
    },
    take: 100,
    orderBy: {
      tradinghours: "desc",
    },
  });

  return {
    one_min: us100_1_min,
    three_min: us100_3_min,
    five_min: us100_5_min,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TradeLock>
) {
  const btc = await btcTrades();
  const oil = await oilTrades();
  const gold = await goldTrades();
  const us100 = await us100Trades();
  res.status(200).json({
    btc,
    oil,
    gold,
    us100,
  });
}
