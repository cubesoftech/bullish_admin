import { AnnouncementInterface } from "../../utils/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, dateCreated, title } = req.body as AnnouncementInterface;
  const createdDate = new Date(dateCreated);
  await prisma.announcement.create({
    data: {
      content,
      createdAt: createdDate,
      title,
      id: Math.floor(Math.random() * 1000000).toString(),
    },
  });
  res.status(200).json({
    message: "Announcement created successfully",
  });
}
