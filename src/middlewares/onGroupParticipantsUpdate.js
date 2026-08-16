/**
 * Evento chamado quando um usuário
 * entra ou sai de um grupo de WhatsApp.
 */
import { BOT_LID, OWNER_LID } from "../config.js";
import { exitMessage, welcomeMessage } from "../messages.js";
import { isAdmin } from "./index.js";
import {
  getBotAdmins,
  getExitMessage,
  getWelcomeMessage,
  isActiveAntifakeGroup,
  isActiveExitGroup,
  isActiveGroup,
  isActiveWelcomeGroup,
  isBotAdmin,
} from "../utils/database.js";
import { extractUserLid, onlyNumbers } from "../utils/index.js";
import { errorLog } from "../utils/logger.js";

function getParticipantId(data) {
  if (typeof data === "string") return data;
  return data?.id || data?.jid || data?.participant || data?.participantAlt || null;
}

function getKnownPhoneNumber(data, participant) {
  const candidates = [
    data?.phoneNumber,
    data?.phone,
    data?.id,
    data?.jid,
    data?.participant,
    data?.participantAlt,
    participant?.phoneNumber,
    participant?.phone,
    participant?.id,
    participant?.jid,
    participant?.participantAlt,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = String(candidate);
    const number = onlyNumbers(value);
    if (number && !value.endsWith("@lid")) return number;
  }

  return null;
}

async function removeForeignParticipant({ data, remoteJid, socket }) {
  if (!isActiveAntifakeGroup(remoteJid)) return false;

  const userLid = getParticipantId(data) || extractUserLid(data);
  if (!userLid) return false;

  const metadata = await socket.groupMetadata(remoteJid);
  const participant = metadata.participants?.find((item) =>
    onlyNumbers(item.id) === onlyNumbers(userLid) ||
    onlyNumbers(item.lid) === onlyNumbers(userLid),
  );
  const phoneNumber = getKnownPhoneNumber(data, participant);

  // Se o WhatsApp só disponibilizar o LID, não removemos ninguém por engano.
  if (!phoneNumber) return false;

  const isProtected =
    onlyNumbers(userLid) === onlyNumbers(BOT_LID) ||
    onlyNumbers(userLid) === onlyNumbers(OWNER_LID) ||
    isBotAdmin(remoteJid, userLid) ||
    getBotAdmins(remoteJid).some(
      (stored) => onlyNumbers(stored) === onlyNumbers(phoneNumber),
    ) ||
    (await isAdmin({ remoteJid, userLid, socket }));

  if (isProtected || phoneNumber.startsWith("55")) return false;

  const targetId = participant?.id || userLid;
  await socket.groupParticipantsUpdate(remoteJid, [targetId], "remove");
  await socket.sendMessage(remoteJid, {
    text: `🚫 @${onlyNumbers(phoneNumber)} removido pelo antifake.\nApenas números brasileiros com indicativo 55 são permitidos.`,
    mentions: [targetId],
  });
  return true;
}

export async function onGroupParticipantsUpdate({
  data,
  remoteJid,
  socket,
  action,
}) {
  try {
    if (!remoteJid.endsWith("@g.us")) {
      return;
    }

    if (!isActiveGroup(remoteJid)) {
      return;
    }

    const userLid = getParticipantId(data) || extractUserLid(data);

    if (action === "add" && (await removeForeignParticipant({ data, remoteJid, socket }))) {
      return;
    }

    if (isActiveWelcomeGroup(remoteJid) && action === "add") {
      const welcomeText = getWelcomeMessage(remoteJid) || welcomeMessage;

      const hasMemberMention = welcomeText.includes("@member");

      const mentions = [];
      let finalWelcomeMessage = welcomeText;

      if (hasMemberMention) {
        const userNumber = onlyNumbers(userLid);
        finalWelcomeMessage = welcomeText.replace(
          "@member",
          `@${userNumber}`,
        );
        mentions.push(userLid);
      }

      await socket.sendMessage(remoteJid, {
        text: finalWelcomeMessage,
        mentions,
      });
    } else if (isActiveExitGroup(remoteJid) && action === "remove") {
      const exitText = getExitMessage(remoteJid) || exitMessage;

      const hasMemberMention = exitText.includes("@member");

      const mentions = [];
      let finalExitMessage = exitText;

      if (hasMemberMention) {
        const userNumber = onlyNumbers(userLid);
        finalExitMessage = exitText.replace("@member", `@${userNumber}`);
        mentions.push(userLid);
      }

      await socket.sendMessage(remoteJid, {
        text: finalExitMessage,
        mentions,
      });
    }
  } catch (error) {
    errorLog(`Erro em onGroupParticipantsUpdate: ${error.message}`);
    errorLog(JSON.stringify(error, null, 2));
  }
}
