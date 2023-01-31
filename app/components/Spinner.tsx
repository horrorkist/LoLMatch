interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-[30px] h-[30px] border-4 border-gray-300 rounded-full border-x-black border-b-black animate-spin ${className}`}
      />
    </div>
  );
}
