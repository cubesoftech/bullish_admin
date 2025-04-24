import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

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
      {
        name: "useNavigation",
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
);

interface CHANGESINTERFACE {
  depositCount: number;
  withdrawalCount: number;
  inquiryCount: number;
  depositInquiryCount: number;
  changeCounts: (
    depositCount: number,
    withdrawalCount: number,
    inquiryCount: number,
    depositInquiryCount: number
  ) => void;
}

export const useChanges = create<CHANGESINTERFACE>()(
  devtools(
    persist(
      (set) => ({
        depositCount: 0,
        withdrawalCount: 0,
        inquiryCount: 0,
        depositInquiryCount: 0,
        changeCounts: (depositCount, withdrawalCount, inquiryCount, depositInquiryCount) =>
          set({ depositCount, withdrawalCount, inquiryCount, depositInquiryCount }),
      }),
      { name: "useChanges" }
    )
  )
);