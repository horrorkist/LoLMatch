import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import client from "../../../../lib/server/client";
import { sessionOptions } from ".";

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  if (req.method === "GET") {
    try {
      const invitations = await client.invitation.findMany({
        where: {
          userId,
          rejected: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sentTeam: {
            include: {
              chief: true,
              members: true,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        invitations,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "Internal Server Error",
      });
    }
  } else if (req.method === "PATCH") {
    const { invitationId } = req.body;

    if (!invitationId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }
    const invitation = await client.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      return res.status(400).json({
        ok: false,
        message: "존재하지 않는 초대입니다.",
      });
    }

    if (invitation.userId !== userId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    try {
      const invitation = await client.invitation.update({
        where: {
          id: invitationId,
        },
        data: {
          rejected: true,
        },
      });

      return res.status(200).json({
        ok: true,
        invitation,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "Internal Server Error",
      });
    }
  } else if (req.method === "DELETE") {
    const { invitationId } = req.body;

    if (!invitationId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }
    const invitation = await client.invitation.findUnique({
      where: {
        id: invitationId,
      },
      select: {
        userId: true,
        rejected: true,
        sentTeam: {
          select: {
            id: true,
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return res.status(400).json({
        ok: false,
        message: "존재하지 않는 초대입니다.",
      });
    }

    if (userId !== invitation.userId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    if (invitation.rejected) {
      return res.status(400).json({
        ok: false,
        message: "이미 거절한 초대입니다.",
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
        message: "존재하지 않는 유저입니다.",
      });
    }

    if (user.teamId) {
      return res.status(400).json({
        ok: false,
        message: "이미 팀에 소속되어 있습니다.",
      });
    }

    if (invitation.sentTeam._count.members >= 5) {
      return res.status(400).json({
        ok: false,
        message: "이미 팀원이 가득찬 팀입니다.",
      });
    }

    try {
      await client.team.update({
        where: {
          id: invitation.sentTeam.id,
        },
        data: {
          members: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await client.invitation.delete({
        where: {
          id: invitationId,
        },
      });

      return res.status(200).json({
        ok: true,
      });
    } catch (e) {
      return res.status(400).json({
        ok: false,
        message: "Internal Server Error.",
      });
    }
  } else {
    return res.status(400).json({
      ok: false,
      message: "Not Allowed Method.",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
