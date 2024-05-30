import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils";

interface Data {
  status: boolean;
  role?: string;
  message: string;
  id?: string;
  userId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }
    const user = await prisma.members.findFirst({
      where: {
        email,
        password,
        role: {
          in: ["ADMIN", "MASTER_AGENT", "AGENT"],
        },
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Invalid email or password",
      });
    }
    return res.status(200).json({
      status: true,
      role: user.role,
      message: "Login successful",
      id: user.id,
      userId: user.email,
    });
  }
  return res.status(405).json({
    status: false,
    message: "Method Not Allowed",
  });
}
