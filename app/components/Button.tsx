interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      className={`p-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:border-white hover:bg-black ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
