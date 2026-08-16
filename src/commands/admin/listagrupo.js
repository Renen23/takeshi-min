import { PREFIX } from "../../config.js";
import { getActiveGroups } from "../../utils/database.js";

export default {
  name: "listagrupo",
  description: "Mostra os grupos ativos (/on) com link para abrir.",
  commands: ["listagrupo", "grupos", "meus-grupos", "grupos-ativos", "grupos-on"],
  usage: `${PREFIX}listagrupo`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ socket, sendReply }) => {
    const groups = getActiveGroups();

    if (!groups.length) {
      await sendReply(
        `Nenhum grupo ativo no momento.\nAtive o bot em um grupo com ${PREFIX}on.`,
      );
      return;
    }

    const lines = [];

    for (const groupId of groups) {
      let name = groupId.replace("@g.us", "");
      let link = "";

      try {
        const metadata = await socket.groupMetadata(groupId);
        name = metadata.subject || name;
      } catch {
        // segue sem nome
      }

      try {
        const code = await socket.groupInviteCode(groupId);

        if (code) {
          link = `https://chat.whatsapp.com/${code}`;
        }
      } catch {
        // bot não é admin: sem link
      }

      lines.push(
        link
          ? `${lines.length + 1}. ${name}\n   ${link}`
          : `${lines.length + 1}. ${name}`,
      );
    }

    await sendReply(`📋 *Grupos com o bot ativo:*\n\n${lines.join("\n")}`);
  },
};
