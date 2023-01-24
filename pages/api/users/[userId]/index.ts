import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../lib/server/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  if (req.method === "GET") {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    try {
      const user = await client.user.findUnique({
        where: { id: userId + "" },
      });

      return res.status(200).json({
        ok: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error,
        message: "서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  }
}
