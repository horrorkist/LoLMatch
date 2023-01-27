import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../lib/server/client";
import { Team } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../users/me";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const NextAuthSession = await unstable_getServerSession(
    req,
    res,
    authOptions
  );
  const { session: IronSession } = req;

  const userId = NextAuthSession?.user?.id || IronSession?.user?.id;

  if (!userId) {
    return res.status(401).json({
      ok: false,
      message: "세션 없음",
    });
  }

  if (req.method === "GET") {
    let team: Team | null;

    try {
      const foundUser = await client.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!foundUser) {
        return res.status(404).json({
          ok: false,
          message: "존재하지 않는 유저입니다.",
        });
      }

      team = await client.team.findUnique({
        where: {
          id: foundUser.teamId || "",
        },
        include: {
          users: true,
        },
      });

      if (!team) {
        return res.status(200).json({
          ok: false,
          message: "존재하지 않는 팀입니다.",
        });
      }

      return res.status(200).json({
        ok: true,
        team,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error,
        message: "서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  } else if (req.method === "POST") {
    const { name, positions, minTier, maxTier, qType } = req.body;

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "팀 이름을 입력해주세요.",
      });
    }

    try {
      const foundUser = await client.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!foundUser) {
        return res.status(404).json({
          ok: false,
          message: "존재하지 않는 유저입니다.",
        });
      }

      if (foundUser.teamId) {
        return res.status(400).json({
          ok: false,
          message: "이미 팀에 가입되어 있습니다.",
        });
      }

      const team = await client.team.create({
        data: {
          name,
          positions: JSON.stringify(positions),
          minTier: +minTier,
          maxTier: +maxTier,
          qType,
          chiefId: foundUser.id,
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return res.status(201).json({
        ok: true,
        team,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error,
        message: "서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  } else if (req.method === "PATCH") {
    const { name, positions, minTier, maxTier, qType, team } = req.body;

    if (team.chiefId !== userId) {
      return res.status(401).json({
        ok: false,
        message: "팀장만 팀 정보를 수정할 수 있습니다.",
      });
    }

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "팀 이름을 입력해주세요.",
      });
    }

    if (!team) {
      return res.status(400).json({
        ok: false,
        message: "팀 정보가 없습니다.",
      });
    }

    try {
      const updatedTeam = await client.team.update({
        where: {
          id: team.id || "",
        },
        data: {
          name,
          positions: JSON.stringify(positions),
          minTier: +minTier,
          maxTier: +maxTier,
          qType,
        },
      });

      return res.status(201).json({
        ok: true,
        updatedTeam,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error,
        message: "서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  } else if (req.method === "DELETE") {
    const { teamId } = req.body;

    const team = await client.team.findUnique({
      where: {
        id: teamId || "",
      },
    });

    if (!team) {
      return res.status(400).json({
        ok: false,
        message: "팀 정보가 없습니다.",
      });
    }

    if (team.chiefId !== userId) {
      return res.status(403).json({
        ok: false,
        message: "권한이 없습니다.",
      });
    }

    try {
      const deletedTeam = await client.team.delete({
        where: {
          id: team.id || "",
        },
      });

      return res.status(201).json({
        ok: true,
        deletedTeam,
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

export default withIronSessionApiRoute(handler, sessionOptions);
