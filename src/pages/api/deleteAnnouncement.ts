import { AnnouncementInterface } from "../../utils/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  await prisma.announcement.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    message: "Delete announcement successfully",
  });
}
