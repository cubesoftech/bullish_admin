import { AnnouncementInterface } from "../../utils/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, content, title } = req.body as any;
  await prisma.announcement.update({
    data: {
      content,
      title,
      id,
    },
    where: {
      id: id,
    },
  });
  res.status(200).json({
    message: "Edit announcement successfully",
  });
}
