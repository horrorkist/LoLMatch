import { UseFormRegister } from "react-hook-form";

interface QTypeSelectProps {
  handleQTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  register?: UseFormRegister<any>;
}

export default function QTypeSelect({
  handleQTypeChange,
  register,
  disabled,
}: QTypeSelectProps) {
  return (
    <div>
      {register ? (
        <select
          {...register("qType")}
          disabled={disabled}
          onChange={handleQTypeChange}
          className="h-12 px-2 text-sm text-white border border-black rounded-md focus:outline-none bg-slate-500"
          name="qType"
          id="qType"
        >
          <option value="0">솔로랭크</option>
          <option value="1">자유랭크</option>
          <option value="2">일반게임</option>
          <option value="3">무작위 총력전</option>
          <option value="4">격전</option>
        </select>
      ) : (
        <select
          disabled={disabled}
          onChange={handleQTypeChange}
          className="h-12 px-2 text-sm text-white border border-black rounded-md focus:outline-none bg-slate-500"
          name="qType"
          id="qType"
        >
          <option value="0">솔로랭크</option>
          <option value="1">자유랭크</option>
          <option value="2">일반게임</option>
          <option value="3">무작위 총력전</option>
          <option value="4">격전</option>
        </select>
      )}
    </div>
  );
}
