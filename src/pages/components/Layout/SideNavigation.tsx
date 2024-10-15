import { ReactNode, useEffect, useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Divider,
  Badge,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { IconType } from "react-icons";
import Image from "next/image";
import logo from "../../../assets/image.png";
import { useAuthentication, useChanges, useNavigation } from "@/utils/storage";
import { LinkItems, LinkItemsAgent, LinkItemsMasterAgent } from "@/utils";
import { GiFamilyTree } from "react-icons/gi";
import useSWR from "swr";
import axios from "axios";
import { FaRegSun, FaRegMoon } from "react-icons/fa6";

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {
        colorMode === "light" ? <IconButton
          aria-label="Dark mode"
          icon={<Icon as={FaRegMoon} />}
          onClick={toggleColorMode}
          colorScheme="teal"
          size={['xs', 'sm']}
          position="fixed"
          top="5"
          zIndex={5}
          right="5"
        /> : <IconButton
          aria-label="Light mode"
          icon={<Icon as={FaRegSun} />}
          onClick={toggleColorMode}
          colorScheme="teal"
          size={['xs', 'sm']}
          position="fixed"
          top="5"
          zIndex={5}
          right="5"
        />
      }
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box maxW={'100%'} ml={{ base: 0, md: 60 }} p="2">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { role } = useAuthentication();
  const linkItems = role === "ADMIN" ? LinkItems : role === "MASTER_AGENT" ? LinkItemsMasterAgent : LinkItemsAgent;



  return (
    <Box
      bgColor={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      color={useColorModeValue("gray.600", "gray.200")}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx={20} justifyContent="space-between">
        <Image src={logo} alt="logo" width={200} height={200} />

        <CloseButton
          color={useColorModeValue("gray.600", "gray.200")}
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>
      {linkItems.map((link) => (
        <NavItem index={link.index} key={link.name} icon={link.icon} onClose={onClose}>
          {link.name}
        </NavItem>
      ))}
      <Divider my="4" />
      {(role === "ADMIN" || role === "MASTER_AGENT") && (
        <>
          <NavItem index={LinkItems.length + 2} icon={GiFamilyTree}>
            에이전트 트리
          </NavItem>

          <Divider my="4" />
        </>
      )}

      <NavItem index={LinkItems.length + 1} icon={FiLogOut}>
        로그 아웃
      </NavItem>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string;
  index: number;
  onClose?: () => void;
}
const NavItem = ({ index, icon, onClose, children, ...rest }: NavItemProps) => {
  const { depositCount, inquiryCount, withdrawalCount, changeCounts } = useChanges();
  const { changeMenu, selectedMenu } = useNavigation();
  const { changeAuthentication } = useAuthentication();
  const handleClick = () => {
    if (index === LinkItems.length + 1) {
      changeAuthentication(false, "ADMIN", "", "");
    } else {
      changeMenu(index);
    }
    onClose?.();
  };
  const [count, setCount] = useState<number | null>(null);

  useSWR<{ depositCount: number, withdrawalCount: number, inquiryCount: number }>("/api/lookoutchanges", () => {
    return axios.get("/api/lookoutchanges").then((res) => res.data);
  }, {
    onSuccess: (data) => {
      const { depositCount, withdrawalCount, inquiryCount } = data;
      changeCounts(depositCount, withdrawalCount, inquiryCount);
    },
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (children === "입금") {
      setCount(depositCount);
    } else if (children === "인출") {
      setCount(withdrawalCount);
    } else if (children === "문의") {
      setCount(inquiryCount);
    } else {
      setCount(null);
    }
  }, [depositCount, inquiryCount, withdrawalCount]);
  return (
    <Flex
      align="center"
      justifyContent={'space-between'}
      p="4"
      mx="4"
      borderRadius="lg"
      color={useColorModeValue("gray.600", "gray.200")}
      bgColor={selectedMenu === index ? "cyan.400" : "transparent"}
      role="group"
      cursor="pointer"
      _hover={{
        bg: "cyan.400",
        color: "white",
      }}
      onClick={() => handleClick()}
      {...rest}
    >
      <HStack>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Text fontWeight="medium">{children}</Text>

      </HStack>
      {
        (Number(count) > 0) && <Badge colorScheme='red'>{count}</Badge>
      }

    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
};
