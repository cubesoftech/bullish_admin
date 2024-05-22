import { MasterAgentInterface } from "../../utils/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

const emailAlreadyExists = async (email: string) => {
  const user = await prisma.members.findFirst({
    where: {
      email,
    },
  });
  return user !== null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name, nickname, password, royalty } =
    req.body as MasterAgentInterface;

  if (await emailAlreadyExists(email)) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const user = await prisma.members.create({
    data: {
      email,
      name,
      nickname,
      password,
      role: "MASTER_AGENT",
      confirmpassword: password,
      id: Math.floor(Math.random() * 1000000).toString(),
    },
  });
  const { id } = user;

  await prisma.masteragents.create({
    data: {
      id: Math.floor(Math.random() * 1000000).toString(),
      memberId: id,
      royalty,
      referralCode: Math.floor(Math.random() * 1000000).toString(),
    },
  });

  res.status(200).json({
    message: "Master Agent created successfully",
  });
}
