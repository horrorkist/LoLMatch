import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../lib/server/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({
        ok: false,
        message: "유효하지 않은 세션입니다. 다시 로그인 해주세요.",
      });
    }

    const userId = session.user.id;
    const { summonerName, positions, tier } = req.body;

    try {
      await client.user.update({
        where: { id: userId },
        data: {
          summonerName,
          positions: JSON.stringify(positions),
          tier: +tier,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "프로필이 성공적으로 업데이트 되었습니다.",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error,
        message: "서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  } else {
    return res.status(405).json({
      ok: false,
      message: "허용되지 않은 메서드입니다.",
    });
  }
}
