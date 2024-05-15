import { PrismaClient } from "@prisma/client";
import { IconType } from "react-icons";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiRotateCcw,
  FiMessageSquare,
} from "react-icons/fi";

export const prisma = new PrismaClient();

interface LinkItemProps {
  name: string;
  icon: IconType;
  index: number;
}

export const LinkItems: Array<LinkItemProps> = [
  { name: "인출", icon: FiHome, index: 0 },
  { name: "매장", icon: FiTrendingUp, index: 1 },
  { name: "게임 설정", icon: FiCompass, index: 2 },
  { name: "사용자 관리", icon: FiStar, index: 3 },
  { name: "발표", icon: FiSettings, index: 5 },
  { name: "문의", icon: FiMessageSquare, index: 7 },
  { name: "주문 내역", icon: FiRotateCcw, index: 6 },
];

export const LinkItemsMasterAgent: Array<LinkItemProps> = [
  { name: "인출", icon: FiHome, index: 0 },
  { name: "매장", icon: FiTrendingUp, index: 1 },
  { name: "사용자 관리", icon: FiStar, index: 3 },
  { name: "발표", icon: FiSettings, index: 5 },
  { name: "문의", icon: FiMessageSquare, index: 7 },
];
