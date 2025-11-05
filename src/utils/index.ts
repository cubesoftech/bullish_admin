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
import { FaChartPie } from "react-icons/fa";
import { TbMessage2Dollar } from "react-icons/tb";

interface LinkItemProps {
  name: string;
  icon: IconType;
  index: number;
}

export const LinkItems: Array<LinkItemProps> = [
  { name: "인출", icon: FiHome, index: 0 },
  { name: "입금", icon: FiTrendingUp, index: 1 },
  { name: "게임 설정", icon: FiCompass, index: 2 },
  { name: "사용자 관리", icon: FiStar, index: 3 },
  { name: "공지사항", icon: FiSettings, index: 5 },
  { name: "문의", icon: FiMessageSquare, index: 7 },
  { name: "입금 계좌 문의", icon: TbMessage2Dollar, index: 11 },
  { name: "주문 내역", icon: FiRotateCcw, index: 6 },
  { name: "답안지", icon: FiRotateCcw, index: 8 },
  { name: "정산", icon: FiStar, index: 9 },
  { name: "Live Betting Status", icon: FaChartPie, index: 10 },
];

export const LinkItemsMasterAgent: Array<LinkItemProps> = [
  { name: "인출", icon: FiHome, index: 0 },
  { name: "입금", icon: FiTrendingUp, index: 1 },
  { name: "사용자 관리", icon: FiStar, index: 3 },
  { name: "공지사항", icon: FiSettings, index: 5 },
  { name: "문의", icon: FiMessageSquare, index: 7 },
  { name: "입금 계좌 문의", icon: TbMessage2Dollar, index: 11 },
  { name: "주문 내역", icon: FiRotateCcw, index: 6 },
  { name: "답안지", icon: FiRotateCcw, index: 8 },
  { name: "정산", icon: FiStar, index: 9 },
  { name: "Live Betting Status", icon: FaChartPie, index: 10 },
];


export const LinkItemsAgent: Array<LinkItemProps> = [
  { name: "인출", icon: FiHome, index: 0 },
  { name: "입금", icon: FiTrendingUp, index: 1 },
  { name: "사용자 관리", icon: FiStar, index: 3 },
  { name: "공지사항", icon: FiSettings, index: 5 },
  { name: "문의", icon: FiMessageSquare, index: 7 },
  { name: "입금계좌문의", icon: TbMessage2Dollar, index: 11 },
  { name: "주문 내역", icon: FiRotateCcw, index: 6 },
  { name: "답안지", icon: FiRotateCcw, index: 8 },
  { name: "정산", icon: FiStar, index: 9 },
];

