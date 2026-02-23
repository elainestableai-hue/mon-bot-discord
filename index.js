const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// IDs des rôles
const ROLE_TRAP_1 = "<@&1462315632019247156>";
const ROLE_TRAP_2 = "<@&1462315838093791423>";
const ROLE_ARENA = "<@&1466790142927962238>";

// Dates d'envoi
let lastSentEvening = null;
let lastSentMorning = null;

client.once("ready", async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);
  console.log(`📨 Salon cible : ${channel.name}`);

  // Trap 1 — 20h15 tous les 2 jours
cron.schedule(
  "15 20 1-31/2 * *",
  () => {
    channel.send(`${ROLE_TRAP_1} 15 minutes before losing to trap 2, beep boop`);
  },
  { timezone: "Europe/Paris" }
);


  // Trap 2 — 10h15 tous les 2 jours
cron.schedule(
  "15 10 2-30/2 * *",
  () => {
    channel.send(`${ROLE_TRAP_2} 15 minutes before bear hunt to beat trap 1, beep boop`);
  },
  { timezone: "Europe/Paris" }
);


  // Arena — tous les jours à 0h30
  cron.schedule(
    "30 0 * * *",
    () => {
      channel.send(`${ROLE_ARENA} Beep Boop Arena reminder !`);
    },
    { timezone: "Europe/Paris" }
  );


   cron.schedule(
    "0 21 * * *",
    () => {
      channel.send(`${ROLE_ARENA} Beep Boop Arena reminder ! 4hours before reset, if you go to sleep`);
    },
    { timezone: "Europe/Paris" }
  );
});

// COMMANDES
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const content = message.content.trim().toLowerCase();

  if (content === "!ping") {
    await message.reply("🏓 Pong !");
    return;
  }

  if (content === "!ping arena") {
    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.send(`${ROLE_ARENA} Beep Boop Arena reminder ! (test)`);
    return;
  }

  if (content === "!elainae") {
    await message.reply("My mistress is the best woman I know, I love her");
    return;
  }

  if (content === "!gk") {
    await message.reply("Everyone kneel down to our queen, GoKart");
    return;
  }

   if (content === "!beer") {
    await message.reply("Take a FST beer my dear friend !");
    return;
  }
});


client.login(TOKEN);



