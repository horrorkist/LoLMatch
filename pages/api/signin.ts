import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./users/me";
import client from "../../lib/server/client";
import bcrypt from "bcrypt";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

const SALT_ROUNDS = 10;

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    const account = await client.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!account || !account.password) {
      return res.status(400).json({
        ok: false,
        message: "존재하지 않는 이메일입니다.",
      });
    }

    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).json({
        ok: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    req.session.destroy();
    req.session.user = {
      id: account.id,
      email: account.email!,
    };

    await req.session.save();

    return res.status(200).json({
      ok: true,
      user: account,
    });
  } else {
    return res.status(405).json({
      ok: false,
      message: "허용되지 않는 메소드입니다.",
    });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
