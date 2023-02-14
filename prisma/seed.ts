import client from "../lib/server/client";
import bcrypt from "bcrypt";

// seed prisma with some data

const hashedPassword = bcrypt.hashSync("12312312", 10);

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomAlphabetString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateMatchHistory() {
  const ret = [];
  for (let i = 0; i < 10; i++) {
    ret.push([true, false][getRandomInt(2)]);
  }
  return ret;
}

function getPositions() {
  const ret = [];
  for (let i = 0; i < 3; i++) {
    ret.push([1, 2, 3, 4, 5][getRandomInt(5)]);
  }
  return ret;
}

async function main() {
  for (let i = 0; i < 100; i++) {
    const user = await client.user.findFirst({
      skip: 5 + i,
      select: {
        id: true,
      },
    });
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        RiotProfileIconId: getRandomInt(5000) + 501,
        team: {
          create: {
            name: getRandomAlphabetString(10),
            chiefId: user?.id,
            positions: JSON.stringify(getPositions()),
            qType: "0",
            minTier: 0,
            maxTier: 9,
            recruitPost: {
              create: {},
            },
          },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await client.$disconnect();
  });
