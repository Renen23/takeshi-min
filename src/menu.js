/**
 * Menu do bot
 */
import pkg from "../package.json" with { type: "json" };
import { BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

export function menuMessage(groupJid) {
  const date = new Date();

  const prefix = getPrefix(groupJid);

  return `╭━━⪩ BEM VINDO! ⪨━━${readMore()}
▢
▢ • ${BOT_NAME}
▢ • Data: ${date.toLocaleDateString("pt-br")}
▢ • Hora: ${date.toLocaleTimeString("pt-br")}
▢ • Prefixo: ${prefix}
▢ • Versão: ${pkg.version}
▢
╰━━─「🪐」─━━

╭━━⪩ DONO ⪨━━
▢
▢ • ${prefix}off
▢ • ${prefix}on
▢ • ${prefix}set-prefix
▢
╰━━─「🌌」─━━

╭━━⪩ ADMINS ⪨━━
▢
▢ • ${prefix}abrir
▢ • ${prefix}ban
▢ • ${prefix}delete
▢ • ${prefix}exit (1/0)
▢ • ${prefix}fechar
▢ • ${prefix}limpar-chat
▢ • ${prefix}link-grupo
▢ • ${prefix}mute
▢ • ${prefix}only-admin (1/0)
▢ • ${prefix}promover
▢ • ${prefix}rebaixar
▢ • ${prefix}unmute
▢ • ${prefix}warn
▢ • ${prefix}unwarn
▢ • ${prefix}warn-reactivate
▢ • ${prefix}welcome (1/0)
▢
╰━━─「⭐」─━━

╭━━⪩ PRINCIPAL ⪨━━
▢
▢ • ${prefix}menu
▢ • ${prefix}meu-lid
▢ • ${prefix}ping
▢
╰━━─「🚀」─━━`;
}
