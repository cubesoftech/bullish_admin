import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Authentication {
    isAuthenticated: boolean;
    changeAuthentication: (isAuthenticated: boolean) => void;
}

export const useAuthentication = create<Authentication>()(
    devtools(
        persist(
            (set) => ({
                isAuthenticated: false,
                changeAuthentication: (isAuthenticated) =>
                    set({ isAuthenticated }),
            }),
            { name: "useAuthentication" }
        )
    )
);

interface Navigation {
    selectedMenu: number;
    changeMenu: (selectedMenu: number) => void;
}

export const useNavigation = create<Navigation>()(
    devtools(
        persist(
            (set) => ({
                selectedMenu: 0,
                changeMenu: (selectedMenu) => set({ selectedMenu }),
            }),
            { name: "useNavigation" }
        )
    )
);
