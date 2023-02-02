interface CancelModalButtonProps {
  closeModal: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function CancelModalButton({
  closeModal,
  children,
  className,
}: CancelModalButtonProps) {
  return (
    <button
      onClick={(e: any) => {
        e.preventDefault();
        closeModal();
      }}
      className={`w-1/3 px-4 py-2 text-black bg-white border border-black rounded-md hover:border-none hover:bg-red-700 hover:text-white hover:border-transparent ${className}}`}
    >
      {children}
    </button>
  );
}
