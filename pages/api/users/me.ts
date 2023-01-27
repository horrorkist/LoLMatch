import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../lib/server/client";
import { User } from "@prisma/client";
import { IronSessionOptions } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id: string;
    };
  }
}

export const sessionOptions: IronSessionOptions = {
  password: "4.96v=AjNYrF6^x_e}tPfE2Kbv#:c?xrMn6P70*mE2+^aA-uauA^Ji3}=RA7)u6g",
  cookieName: "nextjs-iron-session",
  cookieOptions: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const NextApiSession = await unstable_getServerSession(req, res, authOptions);
  const { session: IronSession } = req;

  const userId = NextApiSession?.user?.id || IronSession?.user?.id;

  let user: User | null;

  if (req.method === "GET") {
    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "유효하지 않은 세션입니다.",
      });
    }
    try {
      user = await client.user.findUnique({
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

      return res.status(200).json({
        ok: true,
        user,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  } else if (req.method === "POST") {
    const { summonerName, positions, tier } = req.body;

    try {
      if (userId) {
        user = await client.user.update({
          where: {
            id: userId,
          },
          data: {
            summonerName,
            positions: JSON.stringify(positions),
            tier: +tier,
          },
        });
      } else {
        user = await client.user.create({
          data: {
            summonerName,
            positions: JSON.stringify(positions),
            tier: +tier,
          },
        });
      }

      req.session.user = {
        id: user.id,
      };

      await req.session.save();

      return res.status(200).json({
        ok: true,
        user,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  } else if (req.method === "DELETE") {
    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "유효하지 않은 세션입니다.",
      });
    }
    try {
      user = await client.user.delete({
        where: {
          id: userId,
        },
      });

      return res.status(200).json({
        ok: true,
        user,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        ok: false,
        message: "서버 에러",
      });
    }
  } else {
    return res.status(405).json({
      ok: false,
      message: "허용되지 않는 메소드입니다.",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
