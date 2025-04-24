import { PrismaClient, membertrades_type, recenttrades_type } from "@prisma/client";
//// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const types: recenttrades_type[] = [
    "usdkrw_1_min",
    "usdkrw_2_mins",
    "usdkrw_5_mins",
    "eurusd_1_min",
    "eurusd_2_mins",
    "eurusd_5_mins",
    "jpyusd_1_min",
    "jpyusd_2_mins",
    "jpyusd_5_mins"
  ];
  await Promise.all(types.map((type) => generateData(type)));
  res.status(200).json({ status: "success" });
}

const generateData = async (type: membertrades_type) => {
  const interval = type.includes("1_min") ? 1 : type.includes("2_mins") ? 2 : 5;
  const lastData = await prisma.recenttrades.findFirst({
    where: {
      type,
    },
    orderBy: {
      tradinghours: "desc",
    },
  });
  //start date start from yesterday
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  if (lastData) {
    startDate = lastData.tradinghours;
  }
  const data = randomData(type, 1440 / interval, interval, startDate);

  await prisma.recenttrades.createMany({
    data: data,
    skipDuplicates: true,
  });
  return data;
};

const randomData = (
  type: membertrades_type,
  count: number,
  interval: number,
  startDate: Date
) => {
  //return value is Array<{tradinghours: Date, result: 0 | 1}>
  let data = [];
  let date = new Date(startDate);

  const minutes = date.getMinutes();
  const roundedMinutes = Math.floor(minutes / interval) * interval

  date.setMinutes(roundedMinutes, 0, 0)

  for (let i = 0; i < count; i++) {
    // date = new Date(date.getTime() + interval * 60 * 1000);
    // date.setSeconds(0, 0);
    data.push({
      tradinghours: new Date(date),
      result: Math.round(Math.random()) === 0 ? false : true,
      type,
      id: Math.random().toString(36).substring(7),
    });

    date = new Date(date.getTime() + interval * 60 * 1000)
  }
  return data;
};
