import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";
import { Role } from "@prisma/client";

export interface DepositInterface {
  amount: number;
  membersId: string;
  role: Role;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount, membersId, role } = req.body as DepositInterface;
  await prisma.agents_withdrawals.create({
    data: {
      amount,
      id: Math.floor(Math.random() * 1000000).toString(),
      role,
      status: "pending",
      membersId,
    },
  });
  res.status(200).json({
    message: "Withdrawal created successfully",
  });
}
