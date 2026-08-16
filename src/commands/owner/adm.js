import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import {
  addBotAdmin,
  getBotAdmins,
  isBotAdmin,
  removeBotAdmin,
} from "../../utils/database.js";
import {
  onlyNumbers,
  removeAccentsAndSpecialCharacters,
} from "../../utils/index.js";

export default {
  name: "adm",
  description:
    "Adiciona/remove pessoas como admins do bot (podem usar comandos de admin sem ser admin do WhatsApp).",
  commands: ["adm", "admin", "add-admin", "bot-admin"],
  usage: `${PREFIX}adm add @usuario | ${PREFIX}adm remove @usuario | ${PREFIX}adm lista`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, isReply, replyLid, sendReply, sendSuccessReply }) => {
    const commandWord = args.length ? args[0] : "";
    const normalized = removeAccentsAndSpecialCharacters(
      commandWord.toLowerCase(),
    );

    if (
      !commandWord ||
      ["lista", "listar", "list", "admins", "listar-admins"].includes(
        normalized,
      )
    ) {
      const admins = getBotAdmins();

      if (!admins.length) {
        await sendReply(
          "Nenhum admin do bot cadastrado além de você.\nUse: " +
            `${PREFIX}adm add @usuario`,
        );
        return;
      }

      const list = admins
        .map((lid, index) => `${index + 1}. @${onlyNumbers(lid)}`)
        .join("\n");

      await sendReply(`Admins do bot:\n${list}`, admins);
      return;
    }

    const isRemoveAction = ["remover", "remove", "tirar", "del", "delete"].includes(
      normalized,
    );

    const mention = args.find((arg) => arg.includes("@"));
    const targetLid = isReply ? replyLid : null;

    if (!mention && !targetLid) {
      throw new InvalidParameterError(
        "Mencione um usuário (@) ou responda a mensagem dele!",
      );
    }

    const memberLid = targetLid || `${onlyNumbers(mention)}@lid`;

    if (isRemoveAction) {
      if (!isBotAdmin(memberLid)) {
        await sendReply("Este usuário não é admin do bot.");
        return;
      }

      removeBotAdmin(memberLid);
      await sendSuccessReply(
        `@${onlyNumbers(memberLid)} removido dos admins do bot!`,
        [memberLid],
      );
      return;
    }

    if (isBotAdmin(memberLid)) {
      await sendReply(
        `@${onlyNumbers(memberLid)} já é admin do bot.`,
        [memberLid],
      );
      return;
    }

    addBotAdmin(memberLid);
    await sendSuccessReply(
      `@${onlyNumbers(memberLid)} agora é admin do bot!`,
      [memberLid],
    );
  },
};
