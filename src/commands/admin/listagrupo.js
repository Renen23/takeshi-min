import { PREFIX } from "../../config.js";
import { getActiveGroups } from "../../utils/database.js";

export default {
  name: "listagrupo",
  description: "Mostra a lista dos grupos onde o bot está ativo (/on).",
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
      try {
        const metadata = await socket.groupMetadata(groupId);
        const shortId = groupId.replace("@g.us", "");
        lines.push(`▢ ${metadata.subject} (${shortId.slice(-10)})`);
      } catch {
        lines.push(`▢ ${groupId}`);
      }
    }

    await sendReply(
      `📋 *Grupos com o bot ativo:*\n\n${lines.join("\n")}`,
    );
  },
};
