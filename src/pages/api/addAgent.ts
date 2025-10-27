import { AgentInterface } from "../../utils/interface";
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

const referralCode = () => {
  //5 length number and letter
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name, nickname, password, royalty, masterAgentId } =
    req.body as AgentInterface;

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
      role: "AGENT",
      confirmpassword: password,
      status: true,
      id: Math.floor(Math.random() * 1000000).toString(),
    },
  });

  const { id } = user;

  await prisma.agents.create({
    data: {
      referralCode: referralCode(),
      masteragentsId: masterAgentId,
      memberId: id,
      royalty,
      id: Math.floor(Math.random() * 1000000).toString(),
    },
  });

  res.status(200).json({
    message: "Agent created successfully",
  });
}
