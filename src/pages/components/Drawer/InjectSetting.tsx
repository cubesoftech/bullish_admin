import {
    Button,
    Drawer,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    VStack,
    Text,
    Input,
    useToast,
    Select,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { UserColumn } from "@/utils/interface";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useAdminHooks } from "@/hooks/useAdminHooks";
import { inject_setting } from "@prisma/client";

type InjectSettingPayload = Omit<inject_setting, 'id'> & { id?: string };

function InjectSetting({
    isOpen,
    onClose,
    user,
}: {
    isOpen: boolean;
    onClose: () => void;
    user: UserColumn;
}) {

    const {
        id,
    } = user;

    const [setting, setSetting] = useState<InjectSettingPayload>({
        createdAt: new Date(),
        multiplier: 0,
        status: false,
        userId: id,
    });

    const { getInjectedSetting, injectSetting } = useAdminHooks();

    useEffect(() => {
        if (!isOpen) return;
        getInjectedSetting({ id, showToastError: false })
            .then((response) => {
                if (response) {
                    setSetting(response);
                } else {
                    setSetting({
                        createdAt: new Date(),
                        multiplier: 0,
                        status: false,
                        userId: id,
                    });
                }
            })
    }, [id, isOpen]);

    const toast = useToast()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Set Injector Setting</ModalHeader>

                <ModalBody mb={10}>
                    <VStack spacing={4}>
                        <HStack w={'100%'}>
                            <Text>Multiplier</Text>
                            <NumberInput min={0} value={setting.multiplier} onChange={e => setSetting({ ...setting, multiplier: Number(e) })} w={'100%'}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </HStack>
                        <HStack w={'100%'}>
                            <Text>Status</Text>
                            <Select
                                value={setting.status ? 'true' : 'false'}
                                onChange={(e) => setSetting({ ...setting, status: e.target.value === 'true' })}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Select>
                        </HStack>

                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="outline" mr={3} onClick={() => {
                        injectSetting(setting)
                            .finally(() => {
                                toast({
                                    title: "Success",
                                    description: "Injected",
                                    status: "success"
                                })
                                onClose()
                            });
                    }}>
                        적용
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default InjectSetting;
