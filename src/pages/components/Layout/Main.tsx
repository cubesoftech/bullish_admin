import { Box, Flex } from "@chakra-ui/react";
import SideNavigation from "./SideNavigation";
import { useNavigation } from "@/utils/storage";
import Withdrawals from "../Dashboard/Withdrawals";
import { createColumnHelper } from "@tanstack/react-table";
import { LinkItems } from "@/utils";
import Deposits from "../Dashboard/Deposit";
import UserManagement from "../Dashboard/UserManagement";
import OrderHistory from "../Dashboard/OrderHistory";
import GameSetting from "../Dashboard/GameSettings";

export default function Main() {
    const { selectedMenu } = useNavigation();

    return (
        <SideNavigation>
            {selectedMenu === 0 && <Withdrawals />}
            {selectedMenu === 1 && <Deposits />}
            {selectedMenu === 2 && <GameSetting />}
            {selectedMenu === 3 && <UserManagement />}
            {selectedMenu === 5 && <OrderHistory />}
        </SideNavigation>
    );
}
