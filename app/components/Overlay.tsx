import { ReactNode } from "react";

export default function Overlay({
  closeModal,
  children,
}: {
  closeModal: () => void;
  children: ReactNode;
}) {
  return (
    <div
      onClick={closeModal}
      className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 overlay"
    >
      {children}
    </div>
  );
}
