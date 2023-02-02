import Image from "next/image";

interface PositionImageProps {
  positions?: string;
  position?: number;
  width: number;
  height: number;
}

const PositionArray = ["_", "Top", "Jungle", "Mid", "Bot", "Support"];

export default function PositionImage({
  width,
  height,
  positions,
  position,
}: PositionImageProps) {
  if (positions) {
    return JSON.parse(positions)[0] === 0 ? (
      <div>상관없음</div>
    ) : (
      JSON.parse(positions).map((position: number) => (
        <div key={position}>
          <Image
            src={`/ranked-positions/Position_Plat-${PositionArray[position]}.png`}
            alt="Position Icon"
            width={width}
            height={height}
          />
        </div>
      ))
    );
  }
  if (position !== undefined) {
    return position === 0 ? (
      <div>상관없음</div>
    ) : (
      <li>
        <Image
          src={`/ranked-positions/Position_Plat-${PositionArray[position]}.png`}
          alt="Position Icon"
          width={width}
          height={height}
        />
      </li>
    );
  }
}
