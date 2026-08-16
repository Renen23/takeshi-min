import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  resetExitMessage,
  setExitMessage,
} from "../../utils/database.js";
import { removeAccentsAndSpecialCharacters } from "../../utils/index.js";

export default {
  name: "set-exit",
  description: "Altera a mensagem de saída deste grupo.",
  commands: ["set-exit", "set-saida", "mudar-saida"],
  usage: `${PREFIX}set-exit <mensagem com @member>`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ fullArgs, remoteJid, isGroup, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("Este comando só pode ser usado em grupos.");
    }

    if (!fullArgs) {
      throw new InvalidParameterError(
        `Envie a nova mensagem de saída com @member no lugar do nome.\n\nExemplo: ${PREFIX}set-exit Adeus @member, sentiremos sua falta!`,
      );
    }

    const normalized = removeAccentsAndSpecialCharacters(
      fullArgs.trim().toLowerCase(),
    );

    if (["padrao", "default", "reset"].includes(normalized)) {
      resetExitMessage(remoteJid);
      await sendSuccessReply("Mensagem de saída restaurada para a padrão!");
      return;
    }

    setExitMessage(remoteJid, fullArgs.trim());
    await sendSuccessReply("Mensagem de saída atualizada com sucesso!");
  },
};
