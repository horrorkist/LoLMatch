import { PostType } from "../page";

interface PostTypeButtonsProps {
  handleRecruitChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
  postType: number;
}

function PostTypeButtons({
  handleRecruitChange,
  postType,
}: PostTypeButtonsProps) {
  return (
    <div className="flex space-x-2 type">
      <button
        onClick={handleRecruitChange}
        data-post_type={PostType.RECRUIT}
        className={`flex rounded-md hover:bg-slate-700 border  hover:text-white items-center justify-center h-12 px-2 cursor-pointer ${
          postType === PostType.RECRUIT
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white border-black text-black"
        }`}
      >
        팀원 구해요
      </button>
      <button
        onClick={handleRecruitChange}
        data-post_type={PostType.JOIN}
        className={`flex rounded-md hover:bg-slate-700 border hover:text-white items-center justify-center h-12 px-2 cursor-pointer ${
          postType === PostType.JOIN
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white border-black text-black"
        }`}
      >
        팀을 원해요
      </button>
    </div>
  );
}

export default PostTypeButtons;
