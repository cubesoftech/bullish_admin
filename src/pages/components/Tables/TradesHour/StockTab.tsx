import {
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Stock } from "@/utils/interface";
import HourTab from "./HourTab";

export default function StockTab({ stock }: { stock: Stock }) {
  const { five_min, one_min, three_min } = stock;
  return (
    <VStack boxShadow={"lg"} bgColor={"whiteAlpha.800"} w={"100%"}>
      <Tabs isFitted w={"100%"}>
        <TabList>
          <Tab>1 MINUTE</Tab>
          <Tab>3 MINUTES</Tab>
          <Tab>5 MINUTES</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HourTab trades={one_min} />
          </TabPanel>
          <TabPanel>
            <HourTab trades={three_min} />
          </TabPanel>
          <TabPanel>
            <HourTab trades={five_min} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
