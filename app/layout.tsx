"use client";

import "../styles/globals.css";
import Header from "./components/Header";
import { ReactNode } from "react";
import Provider from "./components/Provider";
import { SWRConfig } from "swr";

const SWROptions = {
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="bg-slate-900">
      <head />
      <body>
        <Provider>
          <SWRConfig value={SWROptions}>
            <div className="relative flex flex-col min-h-screen bg-slate-900">
              <Header />
              {children}
            </div>
          </SWRConfig>
        </Provider>
      </body>
    </html>
  );
}
