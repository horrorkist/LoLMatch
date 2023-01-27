import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../users/me";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  await req.session.save();
  return res.end();
}

export default withIronSessionApiRoute(handler, sessionOptions);
