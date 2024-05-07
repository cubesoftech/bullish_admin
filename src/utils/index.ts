import { PrismaClient } from "@prisma/client";
import { IconType } from "react-icons";
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiRotateCcw,
} from "react-icons/fi";

export const prisma = new PrismaClient();

interface LinkItemProps {
    name: string;
    icon: IconType;
    index: number;
}

export const LinkItems: Array<LinkItemProps> = [
    { name: "Withdrawals", icon: FiHome, index: 0 },
    { name: "Deposits", icon: FiTrendingUp, index: 1 },
    { name: "Game Settings", icon: FiCompass, index: 2 },
    { name: "User Management", icon: FiStar, index: 3 },
    { name: "Personal Message", icon: FiSettings, index: 4 },
    { name: "Order History", icon: FiRotateCcw, index: 5 },
];
