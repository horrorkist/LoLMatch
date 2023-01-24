interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  [key: string]: any;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:border-white hover:bg-black"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
