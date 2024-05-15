import { ReactNode } from "react";
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
} from "@chakra-ui/react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { IconType } from "react-icons";
import Image from "next/image";
import logo from "../../../assets/logo_white.png";
import { useAuthentication, useNavigation } from "@/utils/storage";
import { LinkItems, LinkItemsMasterAgent } from "@/utils";
import { GiFamilyTree } from "react-icons/gi";

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
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
      <Box ml={{ base: 0, md: 60 }} p="4">
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
  const linkItems = role === "ADMIN" ? LinkItems : LinkItemsMasterAgent;
  return (
    <Box
      bgColor={"blackAlpha.900"}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx={20} justifyContent="space-between">
        <Image src={logo} alt="logo" width={200} height={200} />

        <CloseButton
          color={"white"}
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>
      {linkItems.map((link) => (
        <NavItem index={link.index} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      <Divider my="4" />
      {role === "ADMIN" && (
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
}
const NavItem = ({ index, icon, children, ...rest }: NavItemProps) => {
  const { changeMenu, selectedMenu } = useNavigation();
  const { changeAuthentication } = useAuthentication();
  const handleClick = () => {
    if (index === LinkItems.length + 1) {
      changeAuthentication(false, "ADMIN");
    } else {
      changeMenu(index);
    }
  };
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      color={"white"}
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
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Image src={logo} alt="logo" width={200} height={200} />
    </Flex>
  );
};
