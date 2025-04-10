import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import useSWR from "swr";
import { TradeLock } from "@/utils/interface";
import StockTab from "./TradesHour/StockTab";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TradesTab() {
  const { data, isLoading } = useSWR<TradeLock>("/api/trades", fetcher, {
    refreshInterval: 1000,
  });

  if (isLoading) return <div>loading...</div>;
  if (!data) return <div>no data</div>;
  return (
    <VStack boxShadow={"lg"} bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"}>
      <Tabs isFitted w={"100%"}>
        <TabList overflow={'scroll'} >
          <Tab>USD/KRW</Tab>
          <Tab>EUR/USD</Tab>
          <Tab>JPY/USD</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <StockTab stock={data.krw} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.eur} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.jpy} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
