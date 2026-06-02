const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const ms = require("ms");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;

client.on("ready", () => {
  console.log(`${client.user.tag} Online`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
    return;

  const args = message.content.split(" ");
  const command = args[0].toLowerCase();

  const member = message.mentions.members.first();

  if (!member) return;

  if (command === "تايم") {
    const time = args[2];

    if (!time) {
      return message.reply("حدد الوقت");
    }

    await member.timeout(ms(time));
    return message.channel.send(
      `تم إعطاء ${member.user.tag} تايم لمدة ${time}`
    );
  }

  if (command === "طرد" || command === "كيك") {
    await member.kick();
    return message.channel.send(
      `تم طرد ${member.user.tag}`
    );
  }

  if (command === "باند" || command === "بان") {
    await member.ban();
    return message.channel.send(
      `تم حظر ${member.user.tag}`
    );
  }
});

client.login(TOKEN);
