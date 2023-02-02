import { UseFormRegister } from "react-hook-form";

interface TierRangeSelectProps {
  handleTierChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  minTier: number;
  maxTier: number;
  disabled?: boolean;
  register?: UseFormRegister<any>;
}

export default function TierRangeSelect({
  handleTierChange,
  minTier,
  maxTier,
  register,
  disabled,
}: TierRangeSelectProps) {
  return register ? (
    <div className="flex items-center space-x-2">
      <select
        {...register("minTier")}
        disabled={disabled}
        onChange={handleTierChange}
        className="h-12 p-2 text-xs text-white border border-black rounded-md focus:outline-none bg-slate-500"
        name="minTier"
        id="minTier"
        defaultValue={minTier}
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
      <p className="text-white">~</p>
      <select
        {...register("maxTier")}
        disabled={disabled}
        onChange={handleTierChange}
        className="h-12 p-2 text-xs text-white border border-black rounded-md focus:outline-none bg-slate-500"
        name="maxTier"
        id="maxTier"
        defaultValue={maxTier}
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
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <select
        disabled={disabled}
        onChange={handleTierChange}
        className="h-12 p-2 text-xs text-white border border-black rounded-md focus:outline-none bg-slate-500"
        name="minTier"
        id="minTier"
        defaultValue={minTier}
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
      <p className="text-white">~</p>
      <select
        disabled={disabled}
        onChange={handleTierChange}
        className="h-12 p-2 text-xs text-white border border-black rounded-md focus:outline-none bg-slate-500"
        name="maxTier"
        id="maxTier"
        defaultValue={maxTier}
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
    </div>
  );
}
