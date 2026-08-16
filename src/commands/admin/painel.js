import { PREFIX } from "../../config.js";
import { WarningError } from "../../errors/index.js";
import {
  getPrefix,
  getTrustedUsers,
  isActiveAntiLinkGroup,
  isActiveExitGroup,
  isActiveOnlyAdmins,
  isActiveWelcomeGroup,
} from "../../utils/database.js";
import { toUserJid } from "../../utils/index.js";

async function sendPrivateMessage(socket, lid, text) {
  try {
    await socket.sendMessage(lid, { text });
  } catch {
    await socket.sendMessage(toUserJid(lid), { text });
  }
}

export default {
  name: "painel",
  description:
    "Envia no seu privado um painel com o status e os comandos do grupo.",
  commands: ["painel", "painel-admin", "paineladm", "admin-panel", "adm-panel"],
  usage: `${PREFIX}painel`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    socket,
    remoteJid,
    userLid,
    isGroup,
    sendReply,
    sendErrorReply,
  }) => {
    if (!isGroup) {
      throw new WarningError("Este comando só pode ser usado em grupos.");
    }

    const metadata = await socket.groupMetadata(remoteJid);

    const subject = metadata.subject || "Grupo";
    const membersCount = metadata.participants?.length || 0;
    const prefix = getPrefix(remoteJid);

    const trusted = getTrustedUsers(remoteJid);
    const trustedCount = trusted.length;

    const status = (value) => (value ? "✅ Ativo" : "❌ Desativado");

    const panel = `╭━━⪩ PAINEL DO ADM ⪨━━
▢ Grupo: ${subject}
▢ Membros: ${membersCount}
▢ Prefixo: ${prefix}
╰━━─「🔐」─━━

╭━━⪩ STATUS DO GRUPO ⪨━━
▢ Anti-link: ${status(isActiveAntiLinkGroup(remoteJid))}
▢ Só admins: ${status(isActiveOnlyAdmins(remoteJid))}
▢ Boas-vindas: ${status(isActiveWelcomeGroup(remoteJid))}
▢ Saída: ${status(isActiveExitGroup(remoteJid))}
▢ Confiáveis: ${trustedCount} pessoa(s)
╰━━─「📊」─━━

╭━━⪩ MODERAÇÃO ⪨━━
▢ ${prefix}ban / ${prefix}promover / ${prefix}rebaixar
▢ ${prefix}mute / ${prefix}unmute
▢ ${prefix}warn / ${prefix}unwarn
▢ ${prefix}delete / ${prefix}limpar-chat
▢ ${prefix}abrir / ${prefix}fechar / ${prefix}link-grupo
╰━━─「⚙️」─━━

╭━━⪩ RESTRIÇÕES ⪨━━
▢ ${prefix}anti-link (1/0)
▢ ${prefix}confiavel
▢ ${prefix}only-admin (1/0)
▢ ${prefix}welcome (1/0)
▢ ${prefix}exit (1/0)
▢ ${prefix}set-welcome / ${prefix}set-exit
╰━━─「🛡️」─━━

Painel enviado só pra você, admin! 😉`;

    try {
      await sendPrivateMessage(socket, userLid, panel);
      await sendReply("Painel do admin enviado no seu privado! 👀");
    } catch (error) {
      await sendErrorReply(
        "Não consegui te chamar no privado. Abra uma conversa comigo (me manda qualquer coisa) e tente /painel de novo!",
      );
    }
  },
};
