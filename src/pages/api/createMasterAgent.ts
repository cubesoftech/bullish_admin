import { MasterAgentInterface } from "../../utils/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

const emailAlreadyExists = async (email: string) => {
  const user = await prisma.members.findFirst({
    where: {
      email,
      role: "AGENT",
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
      krw_trade: "usdkrw",
      eur_trade: "eurusd",
      jpy_trade: "jpyusd",
    },
  });
  const userAgent = await prisma.members.create({
    data: {
      email,
      name,
      nickname,
      password: password + 123,
      role: "AGENT",
      confirmpassword: password,
      id: Math.floor(Math.random() * 1000000).toString(),
      krw_trade: "usdkrw",
      eur_trade: "eurusd",
      jpy_trade: "jpyusd",
    },
  });

  const { id } = user;

  const masterAgent = await prisma.masteragents.create({
    data: {
      id: Math.floor(Math.random() * 1000000).toString(),
      memberId: id,
      royalty,
      referralCode: referralCode(),
    },
  });

  const agent = await prisma.agents.create({
    data: {
      referralCode: email,
      masteragentsId: masterAgent.id,
      memberId: userAgent.id,
      royalty: masterAgent.royalty,
      id: Math.floor(Math.random() * 1000000).toString(),
    },
  });

  res.status(200).json({
    message: "Master Agent created successfully",
  });
}
