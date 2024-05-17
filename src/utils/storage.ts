import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Authentication {
  isAuthenticated: boolean;
  role: "ADMIN" | "AGENT" | "MASTERAGENT";
  id: string;
  changeAuthentication: (
    isAuthenticated: boolean,
    role: "ADMIN" | "AGENT" | "MASTERAGENT",
    id: string
  ) => void;
}

export const useAuthentication = create<Authentication>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        role: "ADMIN",
        id: "",
        changeAuthentication: (isAuthenticated, role, id) =>
          set({ isAuthenticated, role, id }),
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
