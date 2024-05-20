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
  const { membersId, role } = req.body as DepositInterface;
  if (role === "ADMIN") {
    const withdrawal = await prisma.agents_withdrawals.findMany();
    return res.status(200).json({
      withdrawal,
    });
  }
  const withdrawal = await prisma.agents_withdrawals.findMany({
    where: {
      membersId: membersId,
      role: role,
    },
  });
  res.status(200).json({
    withdrawal,
  });
}
