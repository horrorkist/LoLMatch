import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { NotificationContext } from "./NotiProvider";

function Provider({ children }: { children: ReactNode }) {
  const [prev, setPrev] = useState(0);
  const [count, setCount] = useState(0);
  const [hasNewData, setHasNewData] = useState(false);

  return (
    <SessionProvider>
      <NotificationContext.Provider
        value={{ prev, setPrev, count, hasNewData, setCount, setHasNewData }}
      >
        {children}
      </NotificationContext.Provider>
    </SessionProvider>
  );
}

export default Provider;
