import { PREFIX } from "../../config.js";
import { formatCommand, readCommandImports } from "../../utils/index.js";

export default {
  name: "help",
  description: "Explica os comandos (como usar, exemplos e quem pode usar).",
  commands: ["help", "ajuda", "comandos", "menu-help", "explicar"],
  usage: `${PREFIX}help [comando]`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, prefix, sendReply }) => {
    const commandImports = await readCommandImports();

    if (args.length) {
      const targetName = formatCommand(args[0]);

      for (const [type, commands] of Object.entries(commandImports)) {
        const found = commands.find((cmd) =>
          (cmd.commands || []).map(formatCommand).includes(targetName),
        );

        if (!found) {
          continue;
        }

        const whoCan =
          type === "owner"
            ? "👑 Somente o dono"
            : type === "admin"
            ? "🔐 Dono e autorizados (/adm)"
            : "✅ Dono e autorizados (/adm)";

        const aliases = found.commands
          .map((command) => `${prefix}${command}`)
          .join(", ");

        await sendReply(
          `📘 *${prefix}${found.commands[0]}*\n\n` +
            `📝 *O que faz:*\n${found.description || "Sem descrição."}\n\n` +
            `🔧 *Como usar:*\n${found.usage || `${prefix}${found.commands[0]}`}\n\n` +
            `👤 *Quem pode usar:* ${whoCan}\n\n` +
            `🔁 *Também funciona como:*\n${aliases}`,
        );
        return;
      }

      await sendReply(
        `Comando "${args[0]}" não encontrado. Use ${prefix}help para ver a lista.`,
      );
      return;
    }

    const labels = {
      owner: "👑 DONO",
      admin: "🔐 ADMIN",
      member: "✅ BÁSICOS",
    };

    let text = `📚 *MEUS COMANDOS*\n\n`;

    for (const type of ["owner", "admin", "member"]) {
      const commands = commandImports[type];

      if (!commands?.length) {
        continue;
      }

      text += `╭━━⪩ ${labels[type]} ⪨━━\n`;

      for (const cmd of commands) {
        text += `▢ ${prefix}${cmd.commands[0]} — ${cmd.description || ""}\n`;

        if (cmd.usage && cmd.usage !== `${prefix}${cmd.commands[0]}`) {
          text += `   🔧 ${cmd.usage}\n`;
        }
      }

      text += `╰━━─┄─━━\n\n`;
    }

    text += `Use ${prefix}help <comando> para ver como usar e exemplos.`;

    await sendReply(text);
  },
};
