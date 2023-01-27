import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./users/me";
import client from "../../lib/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session;
  if (req.method === "GET") {
    return res.json({ user });
  } else if (req.method === "DELETE") {
    if (!user) {
      return res.end();
    }

    try {
      await client.user.delete({
        where: {
          id: user.id,
        },
      });

      return res.end();
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  } else {
    return res.status(405).json({
      ok: false,
      message: "허용되지 않는 메소드입니다.",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
