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
    "15 20 * * *",
    () => {
      const today = new Date();

      if (!lastSentEvening) {
        channel.send(`${ROLE_TRAP_1} 15 minutes before losing to trap 2, beep boop`);
        lastSentEvening = today;
        return;
      }

      const diff = (today - lastSentEvening) / (1000 * 60 * 60 * 24);
      if (diff >= 2) {
        channel.send(`${ROLE_TRAP_1} 15 minutes before losing to trap 2, beep boop`);
        lastSentEvening = today;
      }
    },
    { timezone: "Europe/Paris" }
  );

  // Trap 2 — 10h15 tous les 2 jours
  cron.schedule(
    "15 10 * * *",
    () => {
      const today = new Date();

      if (!lastSentMorning) {
        lastSentMorning = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return;
      }

      const diff = (today - lastSentMorning) / (1000 * 60 * 60 * 24);
      if (diff >= 2) {
        channel.send(`${ROLE_TRAP_2} 15 minutes before hunt beep`);
        lastSentMorning = today;
      }
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
});

client.login(TOKEN);
