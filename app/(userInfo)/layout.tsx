import { ReactNode } from "react";
import InfoSidebar from "./InfoSidebar";

function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 divide-black divide-x-1">
      <InfoSidebar />
      {children}
    </div>
  );
}

export default ProfileLayout;
