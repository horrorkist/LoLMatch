import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./users/me";
import client from "../../lib/server/client";
import bcrypt from "bcrypt";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const SALT_ROUNDS = 10;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const NextAuthSession = await unstable_getServerSession(
      req,
      res,
      authOptions
    );
    const IronSession = req.session;

    if (NextAuthSession || IronSession.user?.email) {
      return res.status(400).json({
        ok: false,
        message: "이미 로그인되어 있습니다.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    const exisiting = await client.user.count({
      where: {
        email,
      },
    });

    if (exisiting) {
      return res.status(400).json({
        ok: false,
        message: "이미 존재하는 이메일입니다.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    try {
      const user = await client.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      req.session.destroy();
      req.session.user = {
        id: user.id,
      };

      await req.session.save();

      return res.json({
        ok: true,
        user,
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
      message: "허용되지 않는 메소드입니다.",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
