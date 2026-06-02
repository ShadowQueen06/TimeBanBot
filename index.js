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

  const content = message.content.trim();
  const args = content.split(/\s+/);

  const member = message.mentions.members.first();
  if (!member) return;

  const hasTimePerm = message.member.permissions.has(
    PermissionsBitField.Flags.ModerateMembers
  );

  const hasKickPerm = message.member.permissions.has(
    PermissionsBitField.Flags.KickMembers
  );

  const hasBanPerm = message.member.permissions.has(
    PermissionsBitField.Flags.BanMembers
  );

  const command = args.find(arg =>
    ["تايم", "ميوت", "طرد", "كيك", "باند", "بان", "دي"].includes(arg)
  );

  const time = args.find(arg => ms(arg));

  try {
    if (command === "تايم" || command === "ميوت") {
      if (!hasTimePerm) return;

      if (!time) {
        return message.reply("حدد الوقت");
      }

      await member.timeout(ms(time));

      return message.channel.send(
        `تم إعطاء ${member.user.tag} تايم لمدة ${time}`
      );
    }

    if (command === "طرد" || command === "كيك") {
      if (!hasKickPerm) return;

      await member.kick();

      return message.channel.send(
        `تم طرد ${member.user.tag}`
      );
    }

    if (
      command === "باند" ||
      command === "بان" ||
      command === "دي"
    ) {
      if (!hasBanPerm) return;

      await member.ban();

      return message.channel.send(
        `تم حظر ${member.user.tag}`
      );
    }

  } catch (err) {
    console.error(err);

    return message.reply(
      "ما كدرت أنفذ الأمر. تأكد رتبة البوت أعلى من رتبة الشخص."
    );
  }
});

client.login(TOKEN);
