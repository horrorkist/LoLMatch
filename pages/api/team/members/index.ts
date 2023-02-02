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

  const userId = NextAuthSession?.user?.id;

  if (!userId) {
    return res.status(401).json({
      ok: false,
      message: "세션 없음",
    });
  }

  if (req.method === "PATCH") {
    const { teamId, requestId } = req.body;

    if (!teamId || !requestId) {
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

    if (user.teamId !== teamId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    const team = await client.team.findUnique({
      where: {
        id: teamId,
      },
      select: {
        chiefId: true,
        members: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 팀입니다.",
      });
    }

    if (team.chiefId !== userId) {
      return res.status(403).json({
        ok: false,
        message: "팀장만 팀원을 추가할 수 있습니다.",
      });
    }

    if (team._count.members >= 5) {
      return res.status(403).json({
        ok: false,
        message: "팀원은 5명까지만 초대할 수 있습니다.",
      });
    }

    const request = await client.request.findUnique({
      where: {
        id: requestId,
      },
      select: {
        rejected: true,
        teamId: true,
        sentUser: {
          select: {
            id: true,
            teamId: true,
            leadingTeam: true,
          },
        },
      },
    });

    console.log(request);

    if (!request) {
      return res.status(404).json({
        ok: false,
        message: "이미 만료된 요청입니다.",
      });
    }

    if (teamId !== request.teamId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    if (request.rejected) {
      return res.status(400).json({
        ok: false,
        message: "이미 거절된 요청입니다.",
      });
    }

    if (request.sentUser.teamId) {
      return res.status(400).json({
        ok: false,
        message: "이미 다른 팀에 소속된 유저입니다.",
      });
    }
    try {
      const updatedTeam = await client.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            connect: {
              id: request.sentUser.id,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        updatedTeam,
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
