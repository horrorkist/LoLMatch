import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../lib/server/client";
import { User } from "@prisma/client";
import { IronSessionOptions } from "iron-session";
import {
  getLeagueInfoByEncryptedSummonerId,
  getMatchIdByPuuid,
  getMatchInfoByMatchId,
  getSummonerInfoBySummonerName,
} from "../../../lib/server/api/riot";

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
    if (userId) {
      const existing = await client.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (
        existing?.updatedAt &&
        Number(new Date()) - Number(existing.updatedAt) < 1000 * 30
      ) {
        return res.status(400).json({
          ok: false,
          message: "30초 이내에는 다시 요청할 수 없습니다.",
        });
      }
    }

    const { summonerName, positions } = req.body;

    if (!summonerName) {
      return res.status(400).json({
        ok: false,
        message: "소환사명을 입력해주세요.",
      });
    }

    const {
      id: encryptedSummonerId,
      accountId,
      puuid,
      name,
      profileIconId,
    } = await getSummonerInfoBySummonerName(summonerName);

    if (!encryptedSummonerId) {
      return res.status(400).json({
        ok: false,
        message: "존재하지 않는 소환사 명입니다.",
      });
    }

    const matchIds = await getMatchIdByPuuid(puuid);

    const matchHistory: boolean[] = [];

    for (let i = 0; i < matchIds.length; i++) {
      const {
        info: { participants },
      } = await getMatchInfoByMatchId(matchIds[i]);

      let win = false;

      participants.forEach((participant: any) => {
        if (participant.puuid === puuid) {
          win = participant.win;
        }
      });

      matchHistory.push(win);
    }

    const leagueInfo: any = await getLeagueInfoByEncryptedSummonerId(
      encryptedSummonerId
    );

    let tier, rank, wins, losses;

    if (!leagueInfo) {
      tier = "UNRANKED";
      rank = null;
      wins = null;
      losses = null;
    } else if (leagueInfo instanceof Array) {
      tier = leagueInfo[0].tier;
      rank = leagueInfo[0].rank;
      wins = leagueInfo[0].wins;
      losses = leagueInfo[0].losses;
    } else {
      tier = leagueInfo.tier;
      rank = leagueInfo.rank;
      wins = leagueInfo.wins;
      losses = leagueInfo.losses;
    }

    const tierMap = new Map([
      ["UNRANKED", 0],
      ["IRON", 1],
      ["BRONZE", 2],
      ["SILVER", 3],
      ["GOLD", 4],
      ["PLATINUM", 5],
      ["DIAMOND", 6],
      ["MASTER", 7],
      ["GRANDMASTER", 8],
      ["CHALLENGER", 9],
    ]);

    try {
      if (userId) {
        user = await client.user.update({
          where: {
            id: userId,
          },
          data: {
            summonerName: name,
            positions: JSON.stringify(positions),
            tier: tierMap.get(tier),
            rank,
            wins,
            losses,
            matchHistory: JSON.stringify(matchHistory),
            RiotSummonerId: encryptedSummonerId,
            RiotAccountId: accountId,
            RiotPuuid: puuid,
            RiotProfileIconId: profileIconId,
            updatedAt: new Date(),
          },
        });
      } else {
        user = await client.user.create({
          data: {
            summonerName: name,
            positions: JSON.stringify(positions),
            tier: tierMap.get(tier) || 0,
            rank,
            wins,
            losses,
            matchHistory: JSON.stringify(matchHistory),
            RiotSummonerId: encryptedSummonerId,
            RiotAccountId: accountId,
            RiotPuuid: puuid,
            RiotProfileIconId: profileIconId,
            updatedAt: new Date(),
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
