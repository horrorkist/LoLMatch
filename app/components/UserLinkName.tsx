import { ReactNode } from "react";

export default function UserLinkName({
  children,
  className,
  rest,
}: {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <a
      href={`https://op.gg/summoners/kr/${children}`}
      rel="noreferrer"
      target="_blank"
      className={`text-white hover:underline hover:text-gray-300 ${className}`}
    >
      {children}
    </a>
  );
}
