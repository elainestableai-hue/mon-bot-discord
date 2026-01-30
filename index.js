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

// Stocke la date du dernier envoi
let lastSentEvening = null;   // 20h15
let lastSentMorning = null;   // 10h15

client.once("ready", async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  // Récupération fiable du salon
  const channel = await client.channels.fetch(CHANNEL_ID);
  console.log(`📨 Salon cible : ${channel.name}`);

  // 1️⃣ Tous les 2 jours à 20h15 (Trap 1) — premier envoi aujourd'hui
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

  // 2️⃣ Tous les 2 jours à 10h15 (Trap 2) — premier envoi demain
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

  // 3️⃣ Tous les jours à 0h30 (Arena)
  cron.schedule(
    "30 0 * * *",
    () => {
      channel.send(`${ROLE_ARENA} Beep Boop Arena reminder !`);
    },
    { timezone: "Europe/Paris" }
  );
});

// Commandes
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const args = message.content.toLowerCase().split(" ");

  // !ping arena
  if (args[0] === "!ping" && args[1] === "arena") {
    const channel = await client.channels.fetch(CHANNEL_ID);
    channel.send(`${ROLE_ARENA} Beep Boop Arena reminder ! (test)`);
    return;
  }

  // !ping tout court
  if (message.content === "!ping") {
    message.reply("🏓 Pong !");
    return;
  }

  // autres commandes
  if (message.content === "!Elainaé") {
    message.reply("My mistress is the best woman i know, i love her");
    return;
  }

  if (message.content === "!GK") {
    message.reply("Everyone knee down to our queen, GoKart");
    return;
  }
});


client.login(TOKEN);
