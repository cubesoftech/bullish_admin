import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Authentication {
  isAuthenticated: boolean;
  role: "ADMIN" | "AGENT" | "MASTER_AGENT";
  userId: string;
  id: string;
  changeAuthentication: (
    isAuthenticated: boolean,
    role: "ADMIN" | "AGENT" | "MASTER_AGENT",
    id: string,
    userId: string
  ) => void;
}

export const useAuthentication = create<Authentication>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        role: "ADMIN",
        id: "",
        userId: "",
        changeAuthentication: (isAuthenticated, role, id, userId) =>
          set({ isAuthenticated, role, id, userId }),
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
