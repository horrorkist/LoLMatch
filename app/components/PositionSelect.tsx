import { IFilterParams } from "../page";

interface PositionSelectProps {
  handlePositionChange?: (e: React.MouseEvent<HTMLLIElement>) => void;
  positions?: number[];
  PositionObj: string[];
}

export default function PositionSelect({
  handlePositionChange,
  positions,
  PositionObj,
}: PositionSelectProps) {
  return (
    <>
      <ul className="flex border border-black divide-black rounded-md w-max divide-x-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li
            key={i}
            onClick={handlePositionChange}
            data-position={i}
            className={`group relative flex items-center justify-center w-12 text-white list-none aspect-square first:rounded-l-md last:rounded-r-md position cursor-pointer ${
              positions?.includes(i) ? "bg-blue-500" : "bg-slate-500"
            }`}
          >
            {PositionObj[i]}
            <div className="absolute z-10 flex items-center justify-center w-24 py-2 text-white transition-transform delay-300 origin-top scale-0 bg-black opacity-0 select-none group-hover:duration-300 group-hover:opacity-100 hover:hidden group hover:transition-none group-hover:transition-all duration-0 group-hover:scale-100 -left-1/2 -bottom-full position-name">
              숨겨진 상자
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
