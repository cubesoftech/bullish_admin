import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";
import { InquiryPayload } from "@/utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const inquiry = req.body as InquiryPayload;
  const { answer, id } = inquiry;
  if (answer.length > 0) {
    await prisma.inquiries.update({
      where: {
        id,
      },
      data: {
        answer: answer,
        alreadyAnswered: true,
      },
    });
  }
  res.status(200).json({
    status: "success",
  });
}
