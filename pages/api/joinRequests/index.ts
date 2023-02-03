import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import client from "../../../lib/server/client";
import { authOptions } from "../auth/[...nextauth]";
import { sessionOptions } from "../users/me";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NextSession = await unstable_getServerSession(req, res, authOptions);
  const IronSession = req.session;

  const userId = NextSession?.user?.id || IronSession?.user?.id;

  if (!userId) {
    return res.status(401).json({
      ok: false,
      message: "유효하지 않은 세션입니다.",
    });
  }

  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({
      ok: false,
      message: "잘못된 요청입니다.",
    });
  }

  if (req.method === "POST") {
    try {
      const user = await client.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "존재하지 않는 유저입니다.",
        });
      }

      if (user.teamId) {
        return res.status(400).json({
          ok: false,
          message: "이미 팀에 가입되어 있습니다.",
        });
      }

      const existingRequest = await client.request.findFirst({
        where: {
          userId,
          teamId,
        },
      });

      if (existingRequest) {
        if (
          Number(new Date()) - Number(existingRequest.createdAt) <
          1000 * 15
        ) {
          return res.status(400).json({
            ok: false,
            message: "15초 이내에는 같은 팀에 가입 요청을 할 수 없습니다.",
          });
        }
        await client.request.delete({
          where: {
            id: existingRequest.id,
          },
        });
      }
      const joinRequest = await client.request.create({
        data: {
          summonerName: user.summonerName,
          tier: user.tier,
          position: user.positions,
          sentUser: {
            connect: {
              id: userId,
            },
          },
          receivedTeam: {
            connect: {
              id: teamId,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        joinRequest,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  } else if (req.method === "PATCH") {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        ok: false,
        message: "잘못된 요청입니다.",
      });
    }

    const request = await client.request.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 요청입니다.",
      });
    }

    if (request.rejected) {
      return res.status(400).json({
        ok: false,
        message: "이미 거절된 요청입니다.",
      });
    }

    if (request.teamId !== teamId) {
      return res.status(403).json({
        ok: false,
        message: "권한이 없습니다.",
      });
    }

    try {
      const updated = await client.request.update({
        where: {
          id: requestId,
        },
        data: {
          rejected: true,
        },
      });

      return res.status(200).json({
        ok: true,
        request: updated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "Internal Sever Error",
      });
    }
  } else {
    return res.status(405).json({
      ok: false,
      message: "요청 방식이 올바르지 않습니다.",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
