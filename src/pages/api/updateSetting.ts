import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { SiteSettting } from "@/utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const site = await prisma.sitesettings.findFirst();

  const sitesetting = req.body as SiteSettting;

  await prisma.sitesettings.update({
    where: {
      id: sitesetting.site.id,
    },
    data: {
      ...sitesetting.site,
    },
  });

  res.status(200).json({
    site,
  });
}
