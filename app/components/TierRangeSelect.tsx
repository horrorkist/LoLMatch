interface TierRangeSelectProps {
  handleTierChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TierRangeSelect({
  handleTierChange,
}: TierRangeSelectProps) {
  return (
    <div className="flex items-center justify-between p-2 space-x-2">
      <select
        onChange={handleTierChange}
        className="h-12 p-2 text-sm text-white border border-black rounded-md focus:outline-none bg-slate-500"
        name="minTier"
        id="minTier"
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
      <p>~</p>
      <select
        onChange={handleTierChange}
        className="h-12 p-2 text-sm text-white border border-black rounded-md focus:outline-none bg-slate-500"
        name="maxTier"
        id="maxTier"
        defaultValue={9}
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
