import { UseFormRegister } from "react-hook-form";

interface TierSelectProps {
  register: UseFormRegister<any>;
  [key: string]: any;
}

export default function TierSelect({ register, ...rest }: TierSelectProps) {
  return (
    <select
      {...register("tier", { required: true })}
      {...rest}
      className="h-12 p-2 text-xs text-white border border-black rounded-md w-max focus:outline-none bg-slate-500"
    >
      <option value="0">언랭크</option>
      <option value="1">아이언</option>
      <option value="2">브론즈</option>
      <option value="3">실버</option>
      <option value="4">골드</option>
      <option value="5">플래티넘</option>
      <option value="6">다이아몬드</option>
      <option value="7">마스터</option>
      <option value="8">그랜드마스터</option>
      <option value="9">챌린저</option>
    </select>
  );
}
