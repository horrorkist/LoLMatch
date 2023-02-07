import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../users/me";
import client from "../../../../lib/server/client";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { page, limit, filter } = req.query;
    const parsedFilter = JSON.parse(filter as string);
    const { qType, positions } = parsedFilter;
    let { minTier, maxTier } = parsedFilter;

    if (minTier > maxTier) {
      [minTier, maxTier] = [maxTier, minTier];
    }

    try {
      if (positions.some((position: number) => position === 0)) {
        const recruitPosts = await client.recruitPost.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            team: {
              qType: qType + "",
              minTier: {
                gte: minTier,
              },
              maxTier: {
                lte: maxTier,
              },
            },
          },
          include: {
            team: {
              select: {
                id: true,
                positions: true,
                minTier: true,
                maxTier: true,
                name: true,
                qType: true,
                chief: {
                  select: {
                    id: true,
                    summonerName: true,
                    RiotProfileIconId: true,
                    tier: true,
                    rank: true,
                  },
                },
              },
            },
          },
          skip: Number(page) * Number(limit),
          take: Number(limit),
        });
        return res.status(200).json(recruitPosts);
      } else {
        const recruitPosts = await client.recruitPost.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            team: {
              OR: [
                {
                  positions: {
                    equals: "[0]",
                  },
                },
                {
                  positions: {
                    contains: positions[0] + "",
                  },
                },
                {
                  positions: {
                    contains: positions[1] + "",
                  },
                },
                {
                  positions: {
                    contains: positions[2] + "",
                  },
                },
                {
                  positions: {
                    contains: positions[3] + "",
                  },
                },
                {
                  positions: {
                    contains: positions[4] + "",
                  },
                },
              ],
              qType: qType + "",
              minTier: {
                gte: minTier,
              },
              maxTier: {
                lte: maxTier,
              },
            },
          },
          include: {
            team: {
              select: {
                id: true,
                positions: true,
                minTier: true,
                maxTier: true,
                name: true,
                qType: true,
                chief: {
                  select: {
                    id: true,
                    summonerName: true,
                    RiotProfileIconId: true,
                    tier: true,
                    rank: true,
                  },
                },
              },
            },
          },
          skip: Number(page) * Number(limit),
          take: Number(limit),
        });
        return res.status(200).json(recruitPosts);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  } else if (req.method === "POST") {
    const NextAuthSession = await unstable_getServerSession(
      req,
      res,
      authOptions
    );

    const IronSession = req.session;

    if (!NextAuthSession && !IronSession.user?.email) {
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }

    const { teamId, chiefId } = req.body;

    const userId = NextAuthSession?.user.id || IronSession.user.id;

    if (userId !== chiefId) {
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }

    if (!teamId) {
      return res.status(400).json({
        ok: false,
        message: "팀 아이디가 없습니다.",
      });
    }
    try {
      const recruitPost = await client.recruitPost.upsert({
        where: {
          teamId,
        },
        update: {
          teamId,
          createdAt: new Date(),
        },
        create: {
          teamId,
        },
      });

      return res.status(200).json({
        ok: true,
        recruitPost,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
