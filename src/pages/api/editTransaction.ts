import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { transaction_status, transaction_type } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { status, id, type } = req.body as {
    status: transaction_status;
    id: string;
    type: transaction_type;
  };

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: id,
    },
  });
  if (!transaction) {
    res.status(404).json({
      status: "error",
      message: "Transaction not found",
    });
    return;
  }
  const { amount, membersId } = transaction;
  if (type === "deposit" && status === "completed") {
    console.log("deposit", amount, membersId);
    await prisma.members.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        id: membersId,
      },
    });
  }

  await prisma.transaction.update({
    where: {
      id: id,
      type: type,
    },
    data: {
      status: status,
    },
  });
  res.status(200).json({
    status: "success",
  });
}
