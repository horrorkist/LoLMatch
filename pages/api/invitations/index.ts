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

  if (!userId) {
    return res.status(401).json({ ok: false, message: "Not authenticated" });
  }

  if (req.method === "GET") {
    try {
      const invitations = await client.invitation.findMany({
        where: {
          userId,
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
  } else {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
