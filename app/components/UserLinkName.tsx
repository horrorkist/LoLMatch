import { ReactNode } from "react";

export default function UserLinkName({ children }: { children: ReactNode }) {
  return (
    <a
      href={`https://op.gg/summoners/kr/${children}`}
      rel="noreferrer"
      target="_blank"
      className="text-white hover:underline"
    >
      {children}
    </a>
  );
}
