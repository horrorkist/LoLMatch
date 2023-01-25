import { JoinPost, User } from "@prisma/client";
import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../lib/server/client";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id: string;
    };
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NextAuthSession = await unstable_getServerSession(
    req,
    res,
    authOptions
  );
  const { session: IronSession } = req;

  const { name, qType, tier, positions } = req.body;

  let joinPost: JoinPost;
  let user: User;
  let userId: string;

  try {
    if (NextAuthSession) {
      userId = NextAuthSession.user.id;
    } else if (IronSession.user) {
      userId = IronSession.user.id;
    }

    // @ts-ignore
    if (userId) {
      user = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          summonerName: name,
          tier: +tier,
          positions: JSON.stringify(positions),
        },
      });
      const existing = await client.joinPost.findUnique({
        where: {
          userId,
        },
      });

      if (existing) {
        await client.joinPost.delete({
          where: {
            userId,
          },
        });
      }
    }

    if (!NextAuthSession && !IronSession.user) {
      user = await client.user.create({
        data: {
          summonerName: name,
          tier: +tier,
          positions: JSON.stringify(positions),
          joinPost: {
            create: {
              qType: String(qType),
            },
          },
        },
      });
      IronSession.user = {
        id: user.id,
      };
      await IronSession.save();
      userId = user.id;
    }

    joinPost = await client.joinPost.create({
      data: {
        qType: String(qType),
        user: {
          connect: {
            // @ts-ignore
            id: user.id,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }

  return res.status(200).json({
    ok: true,
    joinPost,
  });
}

const sessionOptions: IronSessionOptions = {
  password: "4.96v=AjNYrF6^x_e}tPfE2Kbv#:c?xrMn6P70*mE2+^aA-uauA^Ji3}=RA7)u6g",
  cookieName: "nextjs-iron-session",
  cookieOptions: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};

export default withIronSessionApiRoute(handler, sessionOptions);
