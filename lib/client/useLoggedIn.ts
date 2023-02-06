import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function useLoggedIn() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const NextAuthSession = useSession();
  const { data: IronSession, isLoading } = useSWR("/api/ironsession");

  useEffect(() => {
    console.log("NextAuthSession", NextAuthSession);
    console.log("IronSession", IronSession);
    if (NextAuthSession.status !== "loading" && !isLoading) {
      setLoggedIn(
        NextAuthSession.status === "authenticated" || IronSession?.user?.email
      );
      setLoading(false);
    }
  }, [NextAuthSession, isLoading]);

  return [loggedIn, loading];
}
