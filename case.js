const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const Pino = require("pino");

module.exports = async (x, msg, msgType, command, text) => {
  const isGroup = msg.key.remoteJid.endsWith("@g.us");
  let group;
  if (isGroup) group = await x.groupMetadata(msg.key.remoteJid);
  switch (command) {
    case "pushkontak":
      x.log("Perintah", command);
      if (!isGroup) {
        await x.reply(
          "*Push Contact*\nPerintah ini hanya bisa digunakan dalam group"
        );
        return;
      }
      const target = group.participants.map((part) => part.id);
      let image;
      if (msgType === "imageMessage") {
        image = await downloadMediaMessage(msg, "buffer", {}, { Pino });
      }
      await x.reply(`*Push Contact*\n*Target:* ${target.length}`);
      x.broadcast(target, text, image);
      break;
    case "tagsemua":
      x.log("Perintah", command);
      if (!isGroup) {
        await x.reply(
          "*Tag Semua*\nPerintah ini hanya bisa digunakan dalam group"
        );
        return;
      }
      x.tagAll(
        msg,
        group.participants.map((part) => part.id),
        text
      );
      break;
    default:
      break;
  }
};
