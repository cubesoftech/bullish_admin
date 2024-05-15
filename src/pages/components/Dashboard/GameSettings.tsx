import { SiteSettting } from "@/utils/interface";
import {
  VStack,
  Heading,
  Icon,
  HStack,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiCompass } from "react-icons/fi";

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
        bgColor={"whiteAlpha.800"}
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
      bgColor={"whiteAlpha.800"}
      spacing={5}
    >
      <HStack
        spacing={10}
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
      </HStack>
    </VStack>
  );
};

const GameReturnSetting = ({ setting }: { setting: SiteSettting }) => {
  const { returnOnWin } = setting.site;

  const toast = useToast();

  const updateSetting = async (value: number) => {
    const url = "/api/updateSetting";
    try {
      await axios.post<SiteSettting>(url, {
        site: {
          ...setting.site,
          returnOnWin: value,
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
    <VStack
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      spacing={10}
    >
      <Text fontWeight={"bold"}>배당수정</Text>
      <NumberInput
        step={0.01}
        onChange={async (e) => {
          await updateSetting(Number(e));
        }}
        defaultValue={returnOnWin}
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

  const toast = useToast();

  const updateSetting = async (value: number, index: number) => {
    const url = "/api/updateSetting";
    const label = ["oneMinLock", "threeMinLock", "fiveMinLock"];
    try {
      await axios.post<SiteSettting>(url, {
        site: {
          ...setting.site,
          [label[index]]: value,
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
    <VStack alignItems={"flex-start"} spacing={7}>
      <Text fontWeight={"bold"}>배팅마감수정</Text>
      {tradingTime.map((time) => {
        return (
          <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Text textAlign={"left"}>{time.label}</Text>
            <NumberInput
              onChange={async (e) => {
                await updateSetting(Number(e), tradingTime.indexOf(time));
              }}
              defaultValue={time.value}
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
  const { nasdaq, btc, gold, wti } = setting.site;
  const tradingStatus = [
    {
      label: "BTCUSDT",
      status: btc ? "OPEN" : "CLOSED",
    },
    { label: "GOLD", status: gold ? "OPEN" : "CLOSED" },
    { label: "NASDAQ", status: nasdaq ? "OPEN" : "CLOSED" },
    { label: "WTI", status: wti ? "OPEN" : "CLOSED" },
  ];

  const options = ["OPEN", "CLOSED"];

  const toast = useToast();

  const updateSetting = async (value: string, index: number) => {
    const url = "/api/updateSetting";
    const label = ["btc", "gold", "nasdaq", "wti"];
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
    <VStack alignItems={"flex-start"} spacing={7}>
      <Text fontWeight={"bold"}>거래현황</Text>
      {tradingStatus.map((status) => {
        return (
          <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Text>{status.label}</Text>
            <Select
              onChange={async (e) => {
                await updateSetting(
                  e.target.value,
                  tradingStatus.indexOf(status)
                );
              }}
              size={"sm"}
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

  const updateSetting = async (value: number) => {
    const url = "/api/updateSetting";
    try {
      await axios.post<SiteSettting>(url, {
        site: {
          ...setting.site,
          minimumAmount: value,
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
    <VStack
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      spacing={10}
    >
      <Text fontWeight={"bold"}>최소 금액</Text>
      <NumberInput
        onChange={async (e) => {
          await updateSetting(Number(e));
        }}
        defaultValue={minimumAmount}
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
