/**
 * Evento chamado quando um usuário
 * entra ou sai de um grupo de WhatsApp.
 */
import { exitMessage, welcomeMessage } from "../messages.js";
import {
  getExitMessage,
  getWelcomeMessage,
  isActiveExitGroup,
  isActiveGroup,
  isActiveWelcomeGroup,
} from "../utils/database.js";
import { extractUserLid, onlyNumbers } from "../utils/index.js";
import { errorLog } from "../utils/logger.js";

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

    const userLid = extractUserLid(data);

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
