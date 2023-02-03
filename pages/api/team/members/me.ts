import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import client from "../../../../lib/server/client";
import { sessionOptions } from "../../users/me";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NextAuthSession = await unstable_getServerSession(
    req,
    res,
    authOptions
  );

  const IronSession = req.session;

  const userId = NextAuthSession?.user?.id || IronSession?.user?.id;

  if (!userId) {
    return res.status(401).json({
      ok: false,
      message: "세션 없음",
    });
  }

  if (req.method === "DELETE") {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        teamId: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    if (!user.teamId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    if (user.teamId !== teamId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    try {
      const updated = await client.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            disconnect: {
              id: userId,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        team: updated,
      });
    } catch (e) {
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
