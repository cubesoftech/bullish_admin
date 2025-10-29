import { Site, SiteSettting, TradesType } from "@/utils/interface";
import { VStack, Heading, Icon, HStack, Text, Select, useToast, Flex, useColorModeValue, Stack } from "@chakra-ui/react";
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { FiCompass } from "react-icons/fi";
import { socket } from "@/utils/socket";

export default function GameSetting() {
  return (
    <VStack spacing={5}>
      <HStack
        alignItems={"flex-end"}
        minH={"10vh"}
        justifyContent={"flex-start"}
        w={"100%"}
        p={5}
        boxShadow={"lg"}
        bgColor={useColorModeValue("whiteAlpha.800", "gray.700")}
      >
        <HStack justifyContent={"center"}>
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={FiCompass}
          />
          <Heading>게임 설정</Heading>
        </HStack>
      </HStack>
      <Setting />
    </VStack>
  );
}

const Setting = () => {
  const [setting, setSetting] = useState<SiteSettting | null>(null);

  const toast = useToast();
  const fetchSetting = async () => {
    const url = "/api/getsiteSetting";
    try {
      const response = await axios.get<SiteSettting>(url);
      setSetting(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching data",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  return (
    <VStack
      alignItems={"flex-start"}
      minH={"60vh"}
      justifyContent={"flex-start"}
      w={"100%"}
      p={5}
      boxShadow={"lg"}
      bgColor={useColorModeValue("whiteAlpha.800", "gray.700")}
      spacing={5}
    >
      <Flex
        direction={['column', 'row']}
        justifyContent={"space-around"}
        alignItems={"flex-start"}
      >
        {setting && (
          <>
            <GameReturnSetting setting={setting} />
            <BetDeadlineSetting setting={setting} />
            <TradingStatus setting={setting} />
            <BalanceSetting setting={setting} />
          </>
        )}
      </Flex>
    </VStack>
  );
};

const GameReturnSetting = ({ setting }: { setting: SiteSettting }) => {
  const { returnOnWin } = setting.site;

  const [siteSettings, setSiteSettings] = useState(returnOnWin)

  const initialRender = useRef(true)

  const toast = useToast();

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const updateSettings = setTimeout(async () => {
      const url = "/api/updateSetting";
      try {
        await axios.post<SiteSettting>(url, {
          site: {
            ...setting.site,
            returnOnWin: siteSettings,
          },
        });
        socket.emit("change_site_settings")
        toast({
          title: "Success",
          description: "Setting updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while updating setting",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }, 1000)

    return () => clearTimeout(updateSettings)
  }, [siteSettings]);

  const updateSetting = async (value: number) => {
    const url = "/api/updateSetting";
    try {
      await axios.post<SiteSettting>(url, {
        site: {
          ...setting.site,
          returnOnWin: value,
        },
      });
      socket.emit("change_site_settings")
      toast({
        title: "Success",
        description: "Setting updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating setting",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack
      m={3}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      spacing={10}
    >
      <Text fontWeight={"bold"}>배당수정</Text>
      <NumberInput
        step={0.01}
        // onChange={async (e) => {
        //   await updateSetting(Number(e));
        // }}
        // defaultValue={returnOnWin}
        defaultValue={siteSettings}
        onChange={(e) => setSiteSettings(Number(e))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </VStack>
  );
};

const BetDeadlineSetting = ({ setting }: { setting: SiteSettting }) => {
  const { oneMinLock, fiveMinLock, threeMinLock, id } = setting.site;
  const tradingTime: Array<{ label: string; value: number }> = [
    { label: "1 Minute Trading", value: oneMinLock },
    { label: "3 Minutes Trading", value: threeMinLock },
    { label: "5 Minutes Trading", value: fiveMinLock },
  ];

  const [siteSettings, setSiteSettings] = useState(tradingTime)

  const toast = useToast();

  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const updateSettings = setTimeout(async () => {
      const url = "/api/updateSetting";
      try {
        await axios.post<SiteSettting>(url, {
          site: {
            id,
            oneMinLock: siteSettings[0].value,
            threeMinLock: siteSettings[1].value,
            fiveMinLock: siteSettings[2].value,
          },
        });
        socket.emit("change_site_settings")
        toast({
          title: "Success",
          description: "Setting updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while updating setting",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }, 1000)

    return () => clearTimeout(updateSettings)
  }, [siteSettings]);

  return (
    <VStack m={3} alignItems={"flex-start"} spacing={7}>
      <Text fontWeight={"bold"}>배팅마감수정</Text>
      {tradingTime.map((time) => {
        return (
          <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Text textAlign={"left"}>{time.label}</Text>
            <NumberInput
              // onChange={async (e) => {
              //   await updateSetting(Number(e), tradingTime.indexOf(time));
              // }}
              // defaultValue={time.value}
              defaultValue={time.value}
              onChange={(e) => {
                const storedStatus = siteSettings.map((item, idx) =>
                  idx === tradingTime.indexOf(time)
                    ? { ...item, value: Number(e) }
                    : item
                )
                setSiteSettings(storedStatus)
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </VStack>
        );
      })}
    </VStack>
  );
};

const TradingStatus = ({ setting }: { setting: SiteSettting }) => {
  const { id, nasdaq, gold, eurusd, pltr, tsla, nvda } = setting.site;

  const initialRender = useRef(true)

  const tradingStatus = [
    { label: "NASDAQ", status: nasdaq ? "OPEN" : "CLOSED", },
    { label: "GOLD", status: gold ? "OPEN" : "CLOSED" },
    { label: "EURUSD", status: eurusd ? "OPEN" : "CLOSED" },
    { label: "PLTR", status: pltr ? "OPEN" : "CLOSED" },
    { label: "TSLA", status: tsla ? "OPEN" : "CLOSED" },
    { label: "NVDA", status: nvda ? "OPEN" : "CLOSED" },
  ]

  const [siteSettings, setSiteSettings] = useState(tradingStatus)

  const toast = useToast();

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const updateSettings = setTimeout(async () => {
      const url = "/api/updateSetting";
      try {
        const res = await axios.post<SiteSettting>(url, {
          site: {
            id,
            krw: siteSettings[0].status === "OPEN" ? true : false,
            eur: siteSettings[1].status === "OPEN" ? true : false,
            jpy: siteSettings[2].status === "OPEN" ? true : false,
          }
        });
        if (res.status === 200) {
          socket.emit("change_site_settings")
          toast({
            title: "Success",
            description: "Setting updated successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (e) {
        toast({
          title: "Error",
          description: e as string,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }, 1000)

    return () => clearTimeout(updateSettings)
  }, [siteSettings])

  const options = ["OPEN", "CLOSED"];

  const updateSetting = async (value: string, index: number) => {
    const url = "/api/updateSetting";
    const label = ["btc", "bnb", "eth", "xrp", "sol", "gold", "nasdaq", "wti"];
    try {
      await axios.post<SiteSettting>(url, {
        site: {
          ...setting.site,
          [label[index]]: value === "OPEN",
        },
      });
      toast({
        title: "Success",
        description: "Setting updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating setting",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack m={3} alignItems={"flex-start"} spacing={7}>
      <Text fontWeight={"bold"}>거래현황</Text>
      {tradingStatus.map((status) => {
        return (
          <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Text>{status.label}</Text>
            <Select
              // onChange={async (e) => {
              //   await updateSetting(
              //     e.target.value,
              //     tradingStatus.indexOf(status)
              //   );
              // }}
              onChange={(e) => {
                const storedStatus = siteSettings.map((item, idx) =>
                  idx === tradingStatus.indexOf(status)
                    ? { ...item, status: e.target.value }
                    : item
                )
                setSiteSettings(storedStatus)
              }}
              size={"md"}
              defaultValue={status.status}
              w={200}
            >
              {options.map((option) => {
                return <option value={option}>{option}</option>;
              })}
            </Select>
          </VStack>
        );
      })}
    </VStack>
  );
};

const BalanceSetting = ({ setting }: { setting: SiteSettting }) => {
  const { minimumAmount } = setting.site;
  const toast = useToast();

  const [siteSettings, setSiteSettings] = useState(minimumAmount)

  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const updateSettings = setTimeout(async () => {
      const url = "/api/updateSetting";
      try {
        await axios.post<SiteSettting>(url, {
          site: {
            ...setting.site,
            minimumAmount: siteSettings,
          },
        });
        socket.emit("change_site_settings")
        toast({
          title: "Success",
          description: "Setting updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while updating setting",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }, 1000)

    return () => clearTimeout(updateSettings)
  }, [siteSettings]);

  const updateSetting = async (value: number) => {
    const url = "/api/updateSetting";
    try {
      await axios.post<SiteSettting>(url, {
        site: {
          ...setting.site,
          minimumAmount: value,
        },
      });
      socket.emit("change_site_settings")
      toast({
        title: "Success",
        description: "Setting updated successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating setting",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      spacing={10}
      m={3}
    >
      <Text fontWeight={"bold"}>최소 금액</Text>
      <NumberInput
        // onChange={async (e) => {
        //   await updateSetting(Number(e));
        // }}
        // defaultValue={minimumAmount}
        defaultValue={siteSettings}
        onChange={(e) => setSiteSettings(Number(e))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </VStack>
  );
};
