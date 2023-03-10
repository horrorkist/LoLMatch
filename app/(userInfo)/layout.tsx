import { ReactNode } from "react";
import InfoSidebar from "./InfoSidebar";

function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 text-white divide-white divide-x-1">
      <InfoSidebar />
      {children}
    </div>
  );
}

export default ProfileLayout;
