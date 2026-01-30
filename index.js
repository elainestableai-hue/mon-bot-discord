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

// Stocke la date du dernier envoi
let lastSentEvening = null;   // 20h15
let lastSentMorning = null;   // 10h15

client.once("ready", async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  // Récupération FIABLE du salon
  const channel = await client.channels.fetch(CHANNEL_ID);
  console.log(`📨 Salon cible : ${channel.name}`);

  // 1️⃣ Tous les 2 jours à 20h15 (premier envoi aujourd'hui)
  cron.schedule("15 20 * * *", () => {
    const today = new Date();

    if (!lastSentEvening) {
      channel.send("@Trap 1, 15 minutes before losing to trap 2, beep boop");
      lastSentEvening = today;
      return;
    }

    const diff = (today - lastSentEvening) / (1000 * 60 * 60 * 24);
    if (diff >= 2) {
      channel.send("@Trap 1, 15 minutes before losing to trap 2, beep boop");
      lastSentEvening = today;
    }
  });

  // 2️⃣ Tous les 2 jours à 10h15 (premier envoi demain)
  cron.schedule("15 10 * * *", () => {
    const today = new Date();

    if (!lastSentMorning) {
      lastSentMorning = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return;
    }

    const diff = (today - lastSentMorning) / (1000 * 60 * 60 * 24);
    if (diff >= 2) {
      channel.send("@Trap 2, 15 minutes before hunt beep");
      lastSentMorning = today;
    }
  });

  // 3️⃣ Tous les jours à 0h30
  cron.schedule("30 0 * * *", () => {
    channel.send("@Arena Beep Boop Arena reminder !");
  });
});

// Commandes
client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "!Elainaé") {
    message.reply("My mistress is the best woman i know, i love her");
  }

  if (message.content === "!GK") {
    message.reply("Everyone knee down to our queen, GoKart");
  }
});

client.login(TOKEN);

