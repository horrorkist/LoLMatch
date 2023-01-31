export interface SummonerInfoResponse {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
}

export async function getSummonerInfoBySummonerName(summonerName: string) {
  const response = await fetch(
    `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_API_KEY}`
  );
  const json = await response.json();
  return json as SummonerInfoResponse;
}

const fetchMatchCount = 10;

export async function getMatchIdByPuuid(puuid: string) {
  const startTime = Math.floor(
    (Number(new Date()) - 1000 * 60 * 60 * 24 * 30) / 1000
  );
  const response = await fetch(
    `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&type=ranked&start=0&count=${fetchMatchCount}&api_key=${process.env.RIOT_API_KEY}`
  );
  const json = await response.json();
  return json as string[];
}

export async function getMatchInfoByMatchId(matchId: string) {
  const response = await fetch(
    `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`
  );
  const json = await response.json();
  return json;
}

export interface LeaguInfoResponse {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export async function getLeagueInfoByEncryptedSummonerId(
  encryptedSummonerId: string
) {
  const response = await fetch(
    `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${process.env.RIOT_API_KEY}`
  );
  const json = await response.json();
  return json[0] as LeaguInfoResponse;
}
