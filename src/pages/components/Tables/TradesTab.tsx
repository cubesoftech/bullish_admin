import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
} from "@chakra-ui/react";
import useSWR from "swr";
import { TradeLock } from "@/utils/interface";
import StockTab from "./TradesHour/StockTab";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TradesTab() {
  const { data, isLoading } = useSWR<TradeLock>("/api/trades", fetcher, {
    refreshInterval: 1000,
  });
  if (isLoading) return <div>loading...</div>;
  if (!data) return <div>no data</div>;
  return (
    <VStack boxShadow={"lg"} bgColor={"whiteAlpha.500"} w={"100%"}>
      <Tabs isFitted w={"100%"}>
        <TabList>
          <Tab>BTC</Tab>
          <Tab>GOLD</Tab>
          <Tab>OIL</Tab>
          <Tab>US100</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <StockTab stock={data.btc} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.gold} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.oil} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.us100} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
