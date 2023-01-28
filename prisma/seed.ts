import client from "../lib/server/client";

async function main() {
  await client.user.updateMany({
    data: {
      summonerName: "test",
      positions: "[0]",
      tier: 5,
    },
  });
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
