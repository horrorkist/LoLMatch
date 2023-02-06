import { IFilterParams } from "../page";
import { getPositionSVG } from "./positionSVG";

interface PositionSelectProps {
  handlePositionChange?: (e: React.MouseEvent<HTMLLIElement>) => void;
  positions?: number[];
}

const PositionObj = ["All", "TOP", "JUG", "MID", "BOT", "SUP"];

export default function PositionSelect({
  handlePositionChange,
  positions,
}: PositionSelectProps) {
  return (
    <>
      <ul className="flex border border-black divide-black rounded-md w-max divide-x-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li
            key={i}
            onClick={handlePositionChange}
            data-position={i}
            className={`group relative hover:bg-slate-700 flex items-center justify-center w-12 text-white list-none aspect-square first:rounded-l-md last:rounded-r-md position cursor-pointer ${
              positions?.includes(i) ? "bg-blue-500" : "bg-slate-500"
            }`}
          >
            {getPositionSVG(i)}
          </li>
        ))}
      </ul>
    </>
  );
}
