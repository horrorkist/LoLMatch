import { createContext } from "react";

interface NotificationContextProps {
  prev: number;
  count: number;
  hasNewData: boolean;
  setPrev: (prev: number) => void;
  setCount: (count: number) => void;
  setHasNewData: (hasNewData: boolean) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  prev: 0,
  count: 0,
  hasNewData: false,
  setPrev: () => {},
  setCount: () => {},
  setHasNewData: () => {},
});
