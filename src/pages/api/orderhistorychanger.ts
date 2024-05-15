import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { OrderHistoryChangerPayload } from "@/utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const order_payload = req.body as OrderHistoryChangerPayload;
  const { balance, membersId, tradeAmount, tradeId, tradePNL, type } =
    order_payload;
  await prisma.membertrades.update({
    where: {
      id: tradeId,
    },
    data: {
      tradeAmount,
      tradePNL,
    },
  });
  await prisma.members.update({
    where: {
      id: membersId,
    },
    data: {
      balance,
    },
  });
  res.status(200).json({
    status: "success",
  });
}
