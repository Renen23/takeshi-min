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

  return `╭━━━〔 🟢 ${BOT_NAME.toUpperCase()} 〕━━━╮${readMore()}
┃
┃ 🐾 *Menu organizado de comandos*
┃ 📅 Data: ${date}
┃ ⏰ Hora: ${time}
┃ 🔑 Prefixo atual: ${prefix}
┃ 🧩 Versão: ${pkg.version}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 👑 DONO DO BOT 〕━━━╮
┃
┃ ⚙️ ${prefix}setprefix <símbolo>
┃    Altera o prefixo do grupo.
┃
┃ 🛡️ ${prefix}adm
┃    Gere os membros autorizados.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🔐 ADMINISTRAÇÃO DO GRUPO 〕━━━╮
┃
┃ 🟢 ${prefix}on          • Ativa o bot no grupo
┃ 🔴 ${prefix}off         • Desativa o bot no grupo
┃ 🚪 ${prefix}abrir       • Abre o grupo
┃ 🚫 ${prefix}fechar      • Fecha o grupo
┃ 👋 ${prefix}ban         • Remove um membro
┃ 🚫 ${prefix}blockwpp    • Bloqueia um número
┃ 🗑️ ${prefix}delete      • Apaga uma mensagem
┃ ⬆️ ${prefix}promover     • Promove a administrador
┃ ⬇️ ${prefix}rebaixar     • Remove administrador
┃ 🔇 ${prefix}mute         • Silencia um membro
┃ 🔊 ${prefix}unmute       • Retira o silêncio
┃ ⏳ ${prefix}adv          • Silencia por tempo
┃ 🧹 ${prefix}limparchat   • Limpa o histórico
┃ 🔗 ${prefix}linkgrupo    • Mostra o link do grupo
┃ 🏷️ ${prefix}setname      • Altera o nome do grupo
┃ ✍️ ${prefix}setwelcome   • Configura boas-vindas
┃ 🚪 ${prefix}setexit      • Configura mensagem de saída
┃
┃ 💬 ${prefix}welcome (1/0)
┃    Liga ou desliga as boas-vindas.
┃
┃ 🚪 ${prefix}exit (1/0)
┃    Liga ou desliga a mensagem de saída.
┃
┃ 🛑 ${prefix}antilink (1/0)
┃    Controla links enviados no grupo.
┃
┃ 🛡️ ${prefix}antifake (1/0)
┃    Remove números estrangeiros sem indicativo 55.
┃
┃ 🟢 ${prefix}confiavel
┃    Gere membros autorizados no anti-link.
┃
┃ ⚠️ ${prefix}warn
┃    Aplica uma advertência.
┃
┃ ✅ ${prefix}unwarn
┃    Remove ou consulta advertências.
┃
┃ ♻️ ${prefix}warnreactivate
┃    Reativa uma advertência inválida.
┃
┃ 🌐 ${prefix}listagrupo
┃    Lista grupos ativos e respetivos links.
┃
┃ 📋 ${prefix}painel
┃    Envia o painel administrativo no privado.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 ✅ COMANDOS GERAIS 〕━━━╮
┃
┃ 📚 ${prefix}menu       • Abre este menu
┃ ❓ ${prefix}help        • Lista todos os comandos
┃ 🔎 ${prefix}help <nome> • Explica um comando
┃ 🏓 ${prefix}ping       • Testa a resposta do bot
┃ 🪪 ${prefix}meulid      • Mostra o seu LID
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 ℹ️ COMO USAR 〕━━━╮
┃
┃ Escreva o prefixo antes do comando.
┃ Exemplo: ${prefix}listagrupo
┃
┃ Os comandos administrativos exigem
┃ autorização e permissões no grupo.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ *Nota:* o WhatsApp não permite alterar a cor real do texto. Os símbolos verdes servem para manter a identidade visual.

💚 Desenvolvido por *Renen* • ${BOT_EMOJI} ${BOT_NAME}`;
}
