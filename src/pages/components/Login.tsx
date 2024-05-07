import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import coverBackground from "../../assets/login_cover.jpg";
import axios from "axios";
import { useState } from "react";
import { useAuthentication } from "@/utils/storage";

export default function Login() {
    const [payload, setPayload] = useState({ email: "", password: "" });
    const { changeAuthentication } = useAuthentication();
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
            const { data } = await axios.post("/api/login", payload);
            if (data.status) {
                toast({
                    title: "Success",
                    description: data.message,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                changeAuthentication(true);
                return;
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                return;
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response.data.message,
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
                            <FormLabel>Email address</FormLabel>
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
                            <FormLabel>Password</FormLabel>
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
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
