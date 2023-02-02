import Image from "next/image";

export default function UserProfileIcon({
  iconId,
  width,
  height,
}: {
  iconId: number;
  width: number;
  height: number;
}) {
  return (
    <Image
      className="rounded-full"
      src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${iconId}.png`}
      alt="Profile Icon"
      width={width}
      height={height}
    />
  );
}
