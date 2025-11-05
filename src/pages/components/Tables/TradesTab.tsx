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
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "@/utils/interfaceV2/api";

interface Tab {
  tab: number,
  setTab: (tab: number) => void
}

const useTab = create<Tab>()(
  persist<Tab>(
    (set) => ({
      tab: 0,
      setTab: (tab: number) => set({ tab })
    }),
    {
      name: "tab-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
)

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TradesTab() {
  const { data, isLoading } = useSWR<TradeLock>(
    "getTrades",
    () => api.getTrades(),
    {
      refreshInterval: 1000,
    }
  );

  const { tab, setTab } = useTab()

  if (isLoading) return <div>loading...</div>;
  if (!data) return <div>no data</div>;
  return (
    <VStack boxShadow={"lg"} bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"}>
      <Tabs isFitted w={"100%"} defaultIndex={tab} onChange={(index) => setTab(index)}>
        <TabList overflow={'scroll'}>
          <Tab>NASDAQ</Tab>
          <Tab>GOLD</Tab>
          <Tab>EURO</Tab>
          <Tab>PALANTIR</Tab>
          <Tab>TESLA</Tab>
          <Tab>NVIDIA</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <StockTab stock={data.nasdaq} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.gold} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.eurusd} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.pltr} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.tsla} />
          </TabPanel>
          <TabPanel>
            <StockTab stock={data.nvda} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
