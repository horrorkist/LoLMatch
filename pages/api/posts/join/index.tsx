import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { IFilterParams } from "../../../../app/page";
import { authOptions } from "../../auth/[...nextauth]";
import client from "../../../../lib/server/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../users/me";

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
        const joinPosts = await client.joinPost.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            qType: qType + "",
            user: {
              tier: {
                gte: minTier,
                lte: maxTier,
              },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                summonerName: true,
                tier: true,
                positions: true,
                RiotProfileIconId: true,
                wins: true,
                losses: true,
                matchHistory: true,
                rank: true,
              },
            },
          },
          skip: Number(page) * Number(limit),
          take: Number(limit),
        });
        return res.status(200).json(joinPosts);
      } else {
        const joinPosts = await client.joinPost.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            OR: [
              {
                user: {
                  positions: {
                    equals: "[0]",
                  },
                },
              },
              {
                user: {
                  positions: {
                    contains: positions[0] + "",
                  },
                },
              },
              {
                user: {
                  positions: {
                    contains: positions[1] + "",
                  },
                },
              },
              {
                user: {
                  positions: {
                    contains: positions[2] + "",
                  },
                },
              },
              {
                user: {
                  positions: {
                    contains: positions[3] + "",
                  },
                },
              },
              {
                user: {
                  positions: {
                    contains: positions[4] + "",
                  },
                },
              },
            ],
            qType: qType + "",
            user: {
              tier: {
                gte: minTier,
                lte: maxTier,
              },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                summonerName: true,
                tier: true,
                positions: true,
                RiotProfileIconId: true,
                wins: true,
                losses: true,
                matchHistory: true,
                rank: true,
              },
            },
          },
          skip: Number(page) * Number(limit),
          take: Number(limit),
        });
        return res.status(200).json(joinPosts);
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
    const { session: IronSession } = req;

    const userId = NextAuthSession?.user?.id || IronSession?.user?.id;

    if (!userId) {
      return res.status(401).json({ ok: false, message: "권한이 없습니다." });
    }

    try {
      const { qType } = req.body;
      const joinPost = await client.joinPost.upsert({
        where: {
          userId,
        },
        create: {
          qType,
          createdAt: new Date(),
          user: {
            connect: {
              id: userId,
            },
          },
        },
        update: {
          qType,
          createdAt: new Date(),
        },
      });

      return res.status(200).json({ ok: true, joinPost });
    } catch (e) {
      console.log(e);
    }
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
