import ContentCopy from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

export default function CopySummonerName({
  summonerName,
}: {
  summonerName: string;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = (e: any) => {
    e.stopPropagation();
    navigator.clipboard.writeText(summonerName);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  return !copied ? (
    <div onClick={(e) => handleCopy(e)} className="relative group/copy">
      <ContentCopy fontSize="small" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute z-30 hidden p-2 text-xs -translate-x-1/2 bg-black rounded-md cursor-default left-1/2 group-hover/copy:flex whitespace-nowrap -top-8"
      >
        소환사 이름 복사하기
      </div>
    </div>
  ) : (
    <div className="relative text-green-500">
      <CheckIcon fontSize="small" />
      <div className="absolute z-30 flex p-2 text-xs text-white -translate-x-1/2 bg-black rounded-md -top-8 left-1/2 whitespace-nowrap">
        복사 완료!
      </div>
    </div>
  );
}
