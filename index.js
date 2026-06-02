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

client.on("clientReady", () => {
console.log(`${client.user.tag} Online`);
});

client.on("messageCreate", async (message) => {
if (message.author.bot) return;

const content = message.content.trim();
const args = content.split(/\s+/);

const member = message.mentions.members.first();

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
[
"تايم",
"ميوت",
"كيك",
"طرد",
"باند",
"بان",
"دي",
"فك",
"unban",
"مسح"
].includes(arg)
);

const time = args.find(arg => {
try {
return ms(arg);
} catch {
return false;
}
});

try {

```
if (command === "تايم" || command === "ميوت") {
  if (!hasTimePerm) return;

  if (!member) {
    return message.reply("منشن الشخص");
  }

  if (!time) {
    return message.reply("حدد الوقت");
  }

  await member.timeout(ms(time));

  return message.channel.send(
    `تم إعطاء ${member.user.tag} تايم لمدة ${time}`
  );
}

if (command === "كيك" || command === "طرد") {
  if (!hasKickPerm) return;

  if (!member) {
    return message.reply("منشن الشخص");
  }

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

  if (!member) {
    return message.reply("منشن الشخص");
  }

  await member.ban();

  return message.channel.send(
    `تم حظر ${member.user.tag}`
  );
}

if (
  command === "فك" ||
  command === "unban"
) {
  if (!hasBanPerm) return;

  const userId = args.find(arg => /^\d+$/.test(arg));

  if (!userId) {
    return message.reply("اكتب ايدي الشخص");
  }

  await message.guild.members.unban(userId);

  return message.channel.send(
    `تم فك الباند عن ${userId}`
  );
}

if (command === "مسح") {
  if (
    !message.member.permissions.has(
      PermissionsBitField.Flags.ManageMessages
    )
  ) {
    return;
  }

  const amount = parseInt(
    args.find(arg => /^\d+$/.test(arg))
  );

  if (!amount) {
    return message.reply("حدد عدد الرسائل");
  }

  if (amount < 1 || amount > 100) {
    return message.reply("العدد يجب أن يكون بين 1 و 100");
  }

  await message.channel.bulkDelete(amount, true);

  const msg = await message.channel.send(
    `تم مسح ${amount} رسالة`
  );

  setTimeout(() => {
    msg.delete().catch(() => {});
  }, 3000);

  return;
}
```

} catch (err) {
console.error(err);

```
return message.reply(
  "ما كدرت أنفذ الأمر. تأكد رتبة البوت أعلى من رتبة الشخص."
);
```

}
});

client.login(TOKEN);

