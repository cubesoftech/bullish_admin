import SideNavigation from "./SideNavigation";
import { useNavigation } from "@/utils/storage";
import Withdrawals from "../Dashboard/Withdrawals";
import Deposits from "../Dashboard/Deposit";
import UserManagement from "../Dashboard/UserManagement";
import OrderHistory from "../Dashboard/OrderHistory";
import GameSetting from "../Dashboard/GameSettings";
import Announcement from "../Dashboard/Announcement";
import Inquiry from "../Dashboard/Inquiry";
import DepositInquiry from "../Dashboard/DepositInquiry";
import { LinkItems } from "@/utils";
import Agents from "../Dashboard/Agents";
import Trades from "../Dashboard/Trades";
import AUDIT from "../Dashboard/Audit";
import LiveBettingStatus from "../Dashboard/LiveBettingStatus";

export default function Main() {
  const { selectedMenu } = useNavigation();
  const agents = LinkItems.length + 2;
  return (
    <SideNavigation>
      {selectedMenu === 0 && <Withdrawals />}
      {selectedMenu === 1 && <Deposits />}
      {selectedMenu === 2 && <GameSetting />}
      {selectedMenu === 3 && <UserManagement />}
      {selectedMenu === 5 && <Announcement />}
      {selectedMenu === 6 && <OrderHistory />}
      {selectedMenu === 7 && <Inquiry />}
      {selectedMenu === 11 && <DepositInquiry />}
      {selectedMenu === 8 && <Trades />}
      {selectedMenu === 9 && <AUDIT />}
      {selectedMenu === 10 && <LiveBettingStatus />}
      {selectedMenu === agents && <Agents />}
    </SideNavigation>
  );
}
