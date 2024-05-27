import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = req.body as any;
  console.log(user);
  await prisma.members.update({
    data: {
      ...user,
    },
    where: {
      id: user.id,
    },
  });
  res.status(200).json({
    status: "success",
  });
}
