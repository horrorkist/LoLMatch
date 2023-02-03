import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sessionOptions } from "../users/me";
import client from "../../../lib/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NextAuthSession = await unstable_getServerSession(
    req,
    res,
    authOptions
  );
  const { session: IronSession } = req;

  const userId = NextAuthSession?.user?.id || IronSession?.user?.id;

  if (req.method === "GET") {
    if (!userId) {
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }
    try {
      const invitations = await client.invitation.findMany({
        where: {
          userId,
        },
        include: {
          sentTeam: {
            include: {
              chief: true,
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
      return res
        .status(500)
        .json({ ok: false, message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    if (!userId) {
      return res
        .status(401)
        .json({ ok: false, message: "먼저 로그인을 하고, 팀을 만들어주세요." });
    }

    const { invitedId, invitingPosition } = req.body;

    if (!invitedId) {
      return res.status(400).json({
        ok: false,
        message: "초대하려는 유저의 정보가 존재하지 않습니다.",
      });
    }

    if (invitingPosition === undefined) {
      return res.status(400).json({
        ok: false,
        message: "포지션을 선택해주세요.",
      });
    }

    const invitingUser = await client.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        team: {
          select: {
            id: true,
            chiefId: true,
            members: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!invitingUser) {
      return res.status(400).json({
        ok: false,
        message: "초대하는 유저의 정보가 존재하지 않습니다.",
      });
    }

    if (!invitingUser.team) {
      return res
        .status(400)
        .json({ ok: false, message: "먼저 팀을 만들어주세요." });
    }

    if (invitingUser.team.chiefId !== userId) {
      return res
        .status(400)
        .json({ ok: false, message: "팀장만 초대할 수 있습니다." });
    }

    if (invitingUser.team.members.find((user) => user.id === invitedId)) {
      return res.status(400).json({ ok: false, message: "이미 팀원입니다." });
    }

    if (invitingUser.team.members.length >= 5) {
      return res
        .status(400)
        .json({ ok: false, message: "팀원은 5명까지 초대할 수 있습니다." });
    }

    const invitedUser = await client.user.findUnique({
      where: {
        id: invitedId,
      },
    });

    if (!invitedUser) {
      return res.status(400).json({
        ok: false,
        message: "초대하려는 유저의 정보가 존재하지 않습니다.",
      });
    }

    try {
      const existingInvitation = await client.invitation.findFirst({
        where: {
          sentTeam: {
            id: invitingUser.team.id,
          },
          receivedUser: {
            id: invitedId,
          },
        },
      });

      if (
        Number(new Date()) - Number(existingInvitation?.createdAt) <
        1000 * 60
      ) {
        return res.status(400).json({
          ok: false,
          message: "초대는 1분에 한 번만 할 수 있습니다.",
        });
      }

      if (existingInvitation) {
        await client.invitation.delete({
          where: {
            id: existingInvitation?.id,
          },
        });
      }

      const invitation = await client.invitation.create({
        data: {
          position: invitingPosition,
          sentTeam: {
            connect: {
              id: invitingUser.team.id,
            },
          },
          receivedUser: {
            connect: {
              id: invitedId,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        invitation,
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ ok: false, message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
