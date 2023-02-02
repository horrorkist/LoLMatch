import Image from "next/image";

interface TierImageProps {
  tier: number;
  width: number;
  height: number;
}

const TierArray = [
  "_",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

export default function TierImage({ tier, width, height }: TierImageProps) {
  return (
    <Image
      src={`/ranked-emblems/Emblem_${TierArray[tier]}.png`}
      alt="Tier Icon"
      width={width}
      height={height}
    />
  );
}
