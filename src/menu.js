/**
 * Menu do bot
 */
import path from "node:path";
import pkg from "../package.json" with { type: "json" };
import { ASSETS_DIR, BOT_EMOJI, BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

let dogIndex = 0;

const dogImages = [1, 2, 3, 4].map((n) =>
  path.join(ASSETS_DIR, "images", "cachorros", `cachorro-0${n}.png`),
);

export function getNextDog() {
  const selectedImage = dogImages[dogIndex];

  dogIndex = (dogIndex + 1) % dogImages.length;

  return selectedImage;
}

export function menuMessage(groupJid) {
  const currentDate = new Date();
  const prefix = getPrefix(groupJid);

  const date = currentDate.toLocaleDateString("pt-BR");
  const time = currentDate.toLocaleTimeString("pt-BR");

  return `╭━━⪩ BEM VINDO! ⪨━━${readMore()}
▢
▢ • ${BOT_NAME} ${BOT_EMOJI}
▢ • Data: ${date}
▢ • Hora: ${time}
▢ • Prefixo: ${prefix}
▢ • Versão: ${pkg.version}
▢
╰━━─「💎」─━━

╭━━⪩ DONO ⪨━━
▢
▢ • ${prefix}on
▢ • ${prefix}off
▢ • ${prefix}set-prefix
▢ • ${prefix}adm
▢
╰━━─「👑」─━━

╭━━⪩ ADMINS ⪨━━
▢
▢ • ${prefix}abrir
▢ • ${prefix}fechar
▢ • ${prefix}ban
▢ • ${prefix}delete
▢ • ${prefix}promover
▢ • ${prefix}rebaixar
▢ • ${prefix}set-exit
▢ • ${prefix}set-welcome
▢ • ${prefix}mute
▢ • ${prefix}unmute
▢ • ${prefix}warn
▢ • ${prefix}unwarn
▢ • ${prefix}limpar-chat
▢ • ${prefix}link-grupo
▢ • ${prefix}welcome (1/0)
▢ • ${prefix}exit (1/0)
▢ • ${prefix}anti-link (1/0)
▢ • ${prefix}confiavel        Lista/libera membros do anti-link
▢ • ${prefix}painel           Painel do admin no privado
▢ • ${prefix}only-admin (1/0)
▢
╰━━─「⭐」─━━

╭━━⪩ PRINCIPAL ⪨━━
▢
▢ • ${prefix}menu
▢ • ${prefix}help [comando]
▢ • ${prefix}ping
▢ • ${prefix}meu-lid
▢
╰━━─「🐶」─━━

⚠️ Só o dono (e quem ele liberar com ${prefix}adm) usa meus comandos.

Feito com carinho por Renen • ${BOT_EMOJI} ${BOT_NAME}`;
}
