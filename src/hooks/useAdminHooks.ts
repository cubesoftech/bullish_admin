import { useToast } from "@chakra-ui/react";
import api from "@/utils/interfaceV2/api";
import { InjectSettingsPayload } from "@/utils/interfaceV2/interfaces/payload";

export const useAdminHooks = () => {

    const toast = useToast({
        duration: 3000,
        status: "error",
        title: "Error",
    });

    const getErrorMessages = (error: any) => {
        let errorMessage = error?.response?.data?.message || error?.message;
        return errorMessage;
    }

    const injectSetting = async (payload: InjectSettingsPayload) => {
        try {
            const data = await api.injectSettings({
                multiplier: payload.multiplier,
                settingsId: payload.settingsId,
                status: payload.status,
                userId: payload.userId,
            })

            return data;
        } catch (error) {
            toast({
                description: error as string
            })
            return error;
        }
    }

    const getInjectedSetting = async ({ id, showToastError }: { id: string, showToastError?: boolean }) => {
        try {
            const { data } = await api.getInjectedSettings({
                userId: id
            })
            return data
        } catch (error) {
            if (showToastError)
                toast({
                    description: error as string
                })
            return null
        }
    }


    return {
        injectSetting,
        getInjectedSetting
    }
}