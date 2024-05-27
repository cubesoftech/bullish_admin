import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const masterAgent = await prisma.members.findMany({
    where: {
      role: "MASTER_AGENT",
    },
  });
  let agentS: any = [];
  const agent = masterAgent.map(async (master) => {
    const { email, name, nickname, password, role } = master;
    console.log(email, role);
    const emailExists = await emailAlreadyExistsAsAgent(email);
    console.log(email, role, emailExists);
    if (!emailExists) {
      const masterAgent = await prisma.masteragents.findFirst({
        where: {
          memberId: master.id,
        },
      });
      if (!masterAgent) {
        agentS.push({ email, data: null, error: "Master agent not found" });
      } else {
        const user = await prisma.members.create({
          data: {
            email,
            name,
            nickname,
            password: password + "123",
            role: "AGENT",
            confirmpassword: password,
            id: Math.floor(Math.random() * 1000000).toString(),
          },
        });
        const agent = await prisma.agents.create({
          data: {
            referralCode: email,
            masteragentsId: masterAgent.id,
            memberId: user.id,
            royalty: masterAgent.royalty,
            id: Math.floor(Math.random() * 1000000).toString(),
          },
        });
        agentS.push({ email, data: agent, error: null });
      }
    } else {
      agentS.push({ email, data: null, error: "Email already exists" });
    }
  });
  await Promise.all(agent);
  res.status(200).json({
    message: "Agent created successfully",
    agents: agentS,
  });
}

const emailAlreadyExistsAsAgent = async (email: string) => {
  const user = await prisma.members.findFirst({
    where: {
      email,
      role: "AGENT",
    },
  });

  return user;
};
