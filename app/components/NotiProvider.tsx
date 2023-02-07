import { createContext } from "react";

interface NotificationContextProps {
  prev: number;
  count: number;
  hasNewInvitation: boolean;
  setPrev: (prev: number) => void;
  setCount: (count: number) => void;
  setHasNewInvitation: (hasNewInvitation: boolean) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  prev: 0,
  count: 0,
  hasNewInvitation: false,
  setPrev: () => {},
  setCount: () => {},
  setHasNewInvitation: () => {},
});
