import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const site = await prisma.sitesettings.findFirst();

  res.status(200).json({
    site,
  });
}
