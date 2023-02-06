import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { sessionOptions } from "..";
import { authOptions } from "../../../auth/[...nextauth]";
import client from "../../../../../lib/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const NextAuthSession = await unstable_getServerSession(
      req,
      res,
      authOptions
    );
    const { session: IronSession } = req;

    const userId = NextAuthSession?.user?.id || IronSession?.user?.id;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: "존재하지 않는 세션입니다.",
      });
    }

    try {
      const count = await client.invitation.count({
        where: {
          userId,
          rejected: false,
        },
      });

      return res.status(200).json({
        ok: true,
        count,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(405).json({
      ok: false,
      message: "Method Not Allowed",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
