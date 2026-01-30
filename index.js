const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // OBLIGATOIRE
  ]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;;

// Stocke la date du dernier envoi pour les messages tous les deux jours
let lastSentEvening = null;   // 20h15
let lastSentMorning = null;   // 10h15

client.once("ready", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const channel = client.channels.cache.get(CHANNEL_ID);

  // 1️⃣ Message tous les deux jours à 20h15, premier envoi aujourd'hui
  cron.schedule("15 20 * * *", () => {
    const today = new Date();

    if (!lastSentEvening) {
      // Premier envoi aujourd'hui
      channel.send("@trap 1, 15 minutes before losing to trap 2, beep boop");
      lastSentEvening = today;
      return;
    }

    // Vérifie si 2 jours se sont écoulés depuis le dernier envoi
    const diff = (today - lastSentEvening) / (1000 * 60 * 60 * 24);
    if (diff >= 2) {
      channel.send("@trap 1, 15 minutes before losing to trap 2, beep boop");
      lastSentEvening = today;
    }
  });

  // 2️⃣ Message tous les deux jours à 10h15, premier envoi demain
  cron.schedule("15 10 * * *", () => {
    const today = new Date();

    if (!lastSentMorning) {
      // Décale le premier envoi à demain
      lastSentMorning = new Date(today.getTime() - 24*60*60*1000);
      return;
    }

    const diff = (today - lastSentMorning) / (1000 * 60 * 60 * 24);
    if (diff >= 2) {
      channel.send("@trap 2, 15 minutes before hunt beep");
      lastSentMorning = today;
    }
  });

  // 3️⃣ Message quotidien à 0h30
  cron.schedule("30 0 * * *", () => {
    channel.send("@everyone Beep Boop Arena reminder !");
  });
});

// Commandes simples
client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "!Elainaé") {
    message.reply("My mistress is the best woman i know, i love her ");
  }
});

client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "!GK") {
    message.reply("Everyone knee down to our queen, GoKart");
  }
});

client.login(TOKEN);
