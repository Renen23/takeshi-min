import path from "node:path";
import pkg from "../package.json" with { type: "json" };
import { ASSETS_DIR, BOT_EMOJI, BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

let dogIndex = 0;

const dogImages = [1, 2, 3, 4].map((number) =>
  path.join(ASSETS_DIR, "images", "cachorros", `cachorro-0${number}.png`),
);

export function getNextDog() {
  const image = dogImages[dogIndex];
  dogIndex = (dogIndex + 1) % dogImages.length;
  return image;
}

export function menuMessage(groupJid) {
  const now = new Date();
  const prefix = getPrefix(groupJid);
  const date = now.toLocaleDateString("pt-BR");
  const time = now.toLocaleTimeString("pt-BR");

  return `╭━━━〔 🟢 MENU PRINCIPAL 〕━━━╮${readMore()}
┃
┃ 🐾 *${BOT_NAME} ${BOT_EMOJI}*
┃ Um bot simples, rápido e pronto para ajudar.
┃
┃ 📅 Data: ${date}
┃ ⏰ Hora: ${time}
┃ 🔑 Prefixo: ${prefix}
┃ 🧩 Versão: ${pkg.version}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 👑 DONO 〕━━━╮
┃
┃ 🟢 ${prefix}on
┃    Ativa o bot no grupo.
┃
┃ 🔴 ${prefix}off
┃    Desativa as respostas do bot.
┃
┃ ⚙️ ${prefix}set-prefix
┃    Altera o prefixo do grupo.
┃
┃ 🛡️ ${prefix}adm
┃    Autoriza um membro a usar comandos.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🔐 ADMINISTRAÇÃO 〕━━━╮
┃
┃ 🚪 ${prefix}abrir  •  Fecha/abre o grupo
┃ 🚫 ${prefix}fechar  •  Restringe o grupo
┃ 👋 ${prefix}ban  •  Remove um membro
┃ 🗑️ ${prefix}delete  •  Apaga uma mensagem
┃ ⬆️ ${prefix}promover  •  Torna membro admin
┃ ⬇️ ${prefix}rebaixar  •  Remove o cargo de admin
┃ 🚪 ${prefix}set-exit  •  Configura saída
┃ 👋 ${prefix}set-welcome  •  Configura boas-vindas
┃ 🔇 ${prefix}mute  •  Silencia o grupo
┃ 🔊 ${prefix}unmute  •  Retira o silêncio
┃ ⚠️ ${prefix}warn  •  Aplica uma advertência
┃ ✅ ${prefix}unwarn  •  Remove uma advertência
┃ 🧹 ${prefix}limpar-chat  •  Limpa o chat
┃ 🔗 ${prefix}link-grupo  •  Obtém o link do grupo
┃
┃ 💬 ${prefix}welcome (1/0)
┃    Liga ou desliga as boas-vindas.
┃
┃ 🚪 ${prefix}exit (1/0)
┃    Liga ou desliga a mensagem de saída.
┃
┃ 🛑 ${prefix}anti-link (1/0)
┃    Controla links enviados no grupo.
┃
┃ 🟢 ${prefix}confiavel
┃    Consulta ou libera membros do anti-link.
┃
┃ 📋 ${prefix}painel
┃    Abre o painel administrativo no privado.
┃
┃ 🌐 ${prefix}listagrupo
┃    Mostra os grupos onde o bot está ativo.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 ✅ COMANDOS GERAIS 〕━━━╮
┃
┃ 📚 ${prefix}menu  •  Abre este menu
┃ ❓ ${prefix}help [comando]  •  Mostra detalhes
┃ 🏓 ${prefix}ping  •  Verifica a resposta do bot
┃ 🪪 ${prefix}meu-lid  •  Mostra o seu identificador
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *Atenção:* apenas o dono e as pessoas autorizadas com ${prefix}adm podem usar os comandos administrativos.

🔇 Quando o bot estiver desligado com ${prefix}off, ele não responderá no grupo.

💚 Desenvolvido com cuidado por *Renen* • ${BOT_EMOJI} ${BOT_NAME}`;
}

// Nota: o WhatsApp não permite alterar a cor real do texto.
// Os símbolos verdes são usados para criar a identidade visual sem desorganizar a mensagem.
