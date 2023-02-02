interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  cancel?: boolean;
  [key: string]: any;
}

export default function Button({
  children,
  onClick,
  className,
  cancel,
}: ButtonProps) {
  return (
    <button
      className={`p-2 border rounded-md ${className} ${
        cancel
          ? "bg-white border-black text-black hover:text-white hover:border-white hover:bg-red-500"
          : "bg-blue-500 text-white border-blue-500 hover:bg-black hover:border-white"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
