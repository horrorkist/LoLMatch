import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { IFilterParams, Post } from "../../../../app/page";
import { authOptions } from "../../auth/[...nextauth]";
import client from "../../../../lib/server/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../users/me";

const p: Post[] = [];

function generatePosts() {
  for (let i = 0; i < 100; i++) {
    const positions = [];
    for (let j = 0; j < 3; j++) {
      positions.push(Math.floor(Math.random() * 3) + 1);
    }
    const qType = Math.floor(Math.random() * 5);
    const minTier = Math.floor(Math.random() * 10);
    const maxTier = Math.floor(Math.random() * 10);
    p.push({
      id: i,
      title: `title${i}`,
      content: `##${i}`,
      positions,
      qType,
      minTier,
      maxTier,
    });
  }
}

generatePosts();

function getMatchedPosts(
  posts: Post[][] | Post[],
  filterParams: IFilterParams
) {
  const { qType, positions } = filterParams;
  let { minTier, maxTier } = filterParams;
  if (minTier > maxTier) [minTier, maxTier] = [maxTier, minTier];

  const flattened = posts.flat();

  let filteredPosts = flattened.filter((post) => {
    return post.qType === qType;
  });
  filteredPosts = filteredPosts.filter((post) => {
    return (
      positions.includes(0) ||
      post.positions.some((position) => positions.includes(position))
    );
  });
  // filteredPosts = filteredPosts.filter((post) => {
  //   return post.minTier >= minTier && post.maxTier <= maxTier;
  // });

  return filteredPosts;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { page, limit, filter } = req.query;
    const parsedFilter = JSON.parse(filter as string);
    const filtered = getMatchedPosts(p, parsedFilter);
    const modified = filtered.slice(
      Number(page) * Number(limit),
      (Number(page) + 1) * Number(limit)
    );
    return res.status(200).json(modified);
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
