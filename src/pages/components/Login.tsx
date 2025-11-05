import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import coverBackground from "../../assets/login_cover.jpg";
import axios from "axios";
import { useState } from "react";
import { useAuthentication, useTokenStore } from "@/utils/storage";
import api from "@/utils/interfaceV2/api";

export default function Login() {
  const [payload, setPayload] = useState({ email: "", password: "" });
  const { changeAuthentication } = useAuthentication();
  const { sa, sa2 } = useTokenStore()
  const toast = useToast();
  const handleSignIn = async () => {
    if (!payload.email || !payload.password) {
      return toast({
        title: "Error",
        description: "Email and password are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    try {
      const { data, message } = await api.login({ ...payload })
      changeAuthentication(true, data.role, data.id, data.userId);
      sa(data.data1)
      sa2(data.data2)
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bgImage={`url(${coverBackground.src})`}
    >
      <Stack
        spacing={8}
        w={"100%"}
        alignItems={"center"}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          w={["80%", 400]}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>아이디</FormLabel>
              <Input
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    email: e.target.value,
                  })
                }
                type="email"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>비밀번호</FormLabel>
              <Input
                onChange={(e) => {
                  setPayload({
                    ...payload,
                    password: e.target.value,
                  });
                }}
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                onClick={handleSignIn}
                _hover={{
                  bg: "blue.500",
                }}
              >
                로그인
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
