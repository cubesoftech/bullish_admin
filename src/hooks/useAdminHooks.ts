import { inject_setting } from "@prisma/client";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const URL_INJECT_SETTING = '/api/injectSetting';

type InjectSettingPayload = Omit<inject_setting, 'id'> & { id?: string };

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

    const injectSetting = async (payload: InjectSettingPayload) => {
        return axios.post(URL_INJECT_SETTING, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                toast({
                    description: getErrorMessages(error)
                })
                return error;
            });
    }

    const getInjectedSetting = async ({ id, showToastError }: { id: string, showToastError?: boolean }) => {
        return axios.post<{ data: inject_setting }>('/api/getInjectedSetting', { id })
            .then((response) => {
                return response.data.data;
            })
            .catch((error) => {
                if (showToastError)
                    toast({
                        description: getErrorMessages(error)
                    })
                return null
            });
    }


    return {
        injectSetting,
        getInjectedSetting
    }
}