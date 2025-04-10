import {
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { Stock } from "@/utils/interface";
import HourTab from "./HourTab";

export default function StockTab({ stock }: { stock: Stock }) {
  const { five_min, one_min, two_min } = stock;
  return (
    <VStack boxShadow={"lg"} bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"}>
      <Tabs isFitted w={"100%"}>
        <TabList>
          <Tab fontSize={'xs'}>1 MINUTE</Tab>
          <Tab fontSize={'xs'}>2 MINUTES</Tab>
          <Tab fontSize={'xs'}>5 MINUTES</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HourTab trades={one_min} />
          </TabPanel>
          <TabPanel>
            <HourTab trades={two_min} />
          </TabPanel>
          <TabPanel>
            <HourTab trades={five_min} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
