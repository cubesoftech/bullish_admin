import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Authentication {
  isAuthenticated: boolean;
  role: "ADMIN" | "AGENT" | "MASTERAGENT";
  changeAuthentication: (
    isAuthenticated: boolean,
    role: "ADMIN" | "AGENT" | "MASTERAGENT"
  ) => void;
}

export const useAuthentication = create<Authentication>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        role: "ADMIN",
        changeAuthentication: (isAuthenticated, role) =>
          set({ isAuthenticated, role }),
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
