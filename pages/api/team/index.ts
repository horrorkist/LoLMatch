import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../lib/server/client";
import { Team } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({
      ok: false,
      message: "유효하지 않은 세션입니다. 다시 로그인 해주세요.",
    });
  }
  if (req.method === "GET") {
    const userId = session.user.id;

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
      });

      if (!team) {
        return res.status(404).json({
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
    const userId = session.user.id;

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

      const team = await client.team.create({
        data: {
          name,
          positions: JSON.stringify(positions),
          minTier: +minTier,
          maxTier: +maxTier,
          qType,
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
  }
  {
    return res.status(405).json({
      ok: false,
      message: "허용되지 않은 메서드입니다.",
    });
  }
}
