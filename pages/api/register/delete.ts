import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  return res.end();
}

const sessionOptions: IronSessionOptions = {
  password: "4.96v=AjNYrF6^x_e}tPfE2Kbv#:c?xrMn6P70*mE2+^aA-uauA^Ji3}=RA7)u6g",
  cookieName: "nextjs-iron-session",
  cookieOptions: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};

export default withIronSessionApiRoute(handler, sessionOptions);
