/**
 * Menu do bot
 */
import path from "node:path";
import pkg from "../package.json" with { type: "json" };
import { ASSETS_DIR, BOT_EMOJI, BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";

let kittenIndex = 0;

const kittenImages = [1, 2, 3, 4].map((n) =>
  path.join(ASSETS_DIR, "images", "gatinhos", `gato-0${n}.png`),
);

export function getNextKitten() {
  const selectedImage = kittenImages[kittenIndex];

  kittenIndex = (kittenIndex + 1) % kittenImages.length;

  return selectedImage;
}

export function menuMessage(groupJid) {
  const currentDate = new Date();
  const prefix = getPrefix(groupJid);

  const date = currentDate.toLocaleDateString("pt-BR");
  const time = currentDate.toLocaleTimeString("pt-BR");

  return `
╭────────────────────╮
│  ✦ CENTRAL DO ${BOT_NAME.toUpperCase()} ✦
╰────────────────────╯

Olá! Eu sou o ${BOT_NAME}.
Estou pronto para ajudar no grupo.

┌─「 INFORMAÇÕES 」
│
│  ◈ Nome: ${BOT_NAME}
│  ◈ Data: ${date}
│  ◈ Horário: ${time}
│  ◈ Prefixo: ${prefix}
│  ◈ Versão: ${pkg.version}
│
└────────────────────

┌─「 CONTROLO DO DONO 」
│
│  ${prefix}on             Ativar o bot
│  ${prefix}off            Desativar o bot
│  ${prefix}set-prefix     Alterar o prefixo
│
└────────────────────

┌─「 FERRAMENTAS DA ADMINISTRAÇÃO 」
│
│  ${prefix}abrir           Abrir o grupo
│  ${prefix}fechar          Fechar o grupo
│  ${prefix}ban             Remover membro
│  ${prefix}delete          Apagar mensagem
│  ${prefix}promover        Promover administrador
│  ${prefix}rebaixar        Remover administrador
│  ${prefix}set-exit        Alterar mensagem de saída
│  ${prefix}set-welcome     Alterar mensagem de boas-vindas
│  ${prefix}mute             Silenciar membro
│  ${prefix}unmute           Retirar silêncio
│  ${prefix}warn             Aplicar advertência
│  ${prefix}unwarn           Remover advertência
│  ${prefix}limpar-chat      Limpar o chat
│  ${prefix}link-grupo       Obter link do grupo
│  ${prefix}welcome (1/0)    Ativar boas-vindas
│  ${prefix}only-admin (1/0) Restringir aos admins
│
└────────────────────

┌─「 COMANDOS RÁPIDOS 」
│
│  ${prefix}menu             Abrir este painel
│  ${prefix}ping             Verificar resposta
│  ${prefix}meu-lid          Consultar o seu LID
│
└────────────────────

╭────────────────────╮
│  Feito com carinho por Renen
│  ${BOT_EMOJI} ${BOT_NAME} • Gatinho do momento
╰────────────────────╯`;
}
