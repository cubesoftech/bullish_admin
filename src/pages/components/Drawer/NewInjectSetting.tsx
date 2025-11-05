import React, { useState, useEffect, use } from "react";
import { Stack, Text, Button, Select, useToast } from "@chakra-ui/react";
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, } from "@chakra-ui/react"
import { UserColumn } from "@/utils/interface";
import { useAdminHooks } from "@/hooks/useAdminHooks";
import { InjectSettingsPayload } from "@/utils/interfaceV2/interfaces/payload";

export default function NewInjectSetting({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: UserColumn }) {

    const toast = useToast()

    const { id } = user

    const [setting, setSetting] = useState<InjectSettingsPayload>({
        multiplier: 0,
        status: false,
        userId: id,
        settingsId: ""
    });

    const { getInjectedSetting, injectSetting } = useAdminHooks();

    useEffect(() => {
        getInjectedSetting({ id, showToastError: false })
            .then((response) => {
                if (response) {
                    setSetting({
                        multiplier: response.multiplier,
                        status: response.status,
                        userId: response.userId,
                        settingsId: response.id
                    });
                } else {
                    setSetting({
                        multiplier: 0,
                        status: false,
                        userId: id,
                        settingsId: ""
                    });
                }
            })
    }, [id, isOpen]);

    return (
        <Stack w={"100%"} h={"full"}>
            <Stack w={"100%"} direction={"row"} gap={0} alignItems={"center"}>
                <Text w={"30%"}>Multiplier</Text>
                <NumberInput
                    min={0} w={'70%'}
                    value={setting.multiplier} onChange={e => setSetting({ ...setting, multiplier: Number(e) })}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Stack>
            <Stack w={"100%"} direction={"row"} gap={0} alignItems={"center"}>
                <Text w={"30%"}>Status</Text>
                <Select
                    value={setting.status ? 'true' : 'false'}
                    onChange={(e) => setSetting({ ...setting, status: e.target.value === 'true' })}
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </Select>
            </Stack>
            <Stack w={"100%"} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Button
                    colorScheme="blue" variant={"outline"}
                    onClick={() => {
                        injectSetting(setting)
                            .finally(() => {
                                toast({
                                    title: "Success",
                                    description: "Injected",
                                    status: "success"
                                })
                            })
                    }}
                >
                    적용
                </Button>
            </Stack>
        </Stack>
    );
}