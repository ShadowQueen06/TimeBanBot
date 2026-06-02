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

  const args = message.content.trim().split(/\s+/);
  const command = args.find(a => ["تايم","ميوت","كيك","طرد","باند","بان","دي","فك","unban","مسح"].includes(a));
  const member = message.mentions.members.first();
  const time = args.find(a => ms(a));
  const number = args.find(a => /^\d+$/.test(a));

  try {
    if (command === "مسح") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
      const amount = parseInt(number);

      if (!amount) return message.reply("حدد عدد الرسائل");
      if (amount < 1 || amount > 100) return message.reply("العدد يجب أن يكون بين 1 و 100");

      await message.channel.bulkDelete(amount, true);
      const msg = await message.channel.send(`تم مسح ${amount} رسالة`);
      setTimeout(() => msg.delete().catch(() => {}), 3000);
      return;
    }

    if (command === "تايم" || command === "ميوت") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return;
      if (!member) return message.reply("منشن الشخص");
      if (!time) return message.reply("حدد الوقت");

      await member.timeout(ms(time));
      return message.channel.send(`تم إعطاء ${member.user.tag} تايم لمدة ${time}`);
    }

    if (command === "كيك" || command === "طرد") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return;
      if (!member) return message.reply("منشن الشخص");

      await member.kick();
      return message.channel.send(`تم طرد ${member.user.tag}`);
    }

    if (command === "باند" || command === "بان" || command === "دي") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
      if (!member) return message.reply("منشن الشخص");

      await member.ban();
      return message.channel.send(`تم حظر ${member.user.tag}`);
    }

    if (command === "فك" || command === "unban") {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
      if (!number) return message.reply("اكتب ايدي الشخص");

      await message.guild.members.unban(number);
      return message.channel.send(`تم فك الباند عن ${number}`);
    }
  } catch (err) {
    console.error(err);
    return message.reply("ما كدرت أنفذ الأمر. تأكد رتبة البوت أعلى من رتبة الشخص.");
  }
});

client.login(TOKEN);

