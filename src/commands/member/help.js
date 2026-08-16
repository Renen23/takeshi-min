import { PREFIX } from "../../config.js";
import { formatCommand, readCommandImports } from "../../utils/index.js";

const sectionNames = {
  owner: "👑 DONO",
  admin: "🔐 ADMINISTRAÇÃO",
  member: "✅ COMANDOS GERAIS",
};

function permissionLabel(type) {
  if (type === "owner") return "👑 Apenas o dono";
  if (type === "admin") return "🔐 Dono e administradores autorizados";
  return "✅ Dono e membros autorizados";
}

export default {
  name: "help",
  description: "Apresenta os comandos, a forma de utilização e as permissões.",
  commands: ["help", "ajuda", "comandos", "menu-help", "explicar"],
  usage: `${PREFIX}help [comando]`,

  handle: async ({ args, prefix, sendReply }) => {
    const commandImports = await readCommandImports();

    if (args.length) {
      const targetName = formatCommand(args[0]);

      for (const [type, commands] of Object.entries(commandImports)) {
        const command = commands.find((item) =>
          (item.commands || []).map(formatCommand).includes(targetName),
        );

        if (!command) continue;

        const commandName = command.commands[0];
        const aliases = command.commands
          .map((alias) => `${prefix}${alias}`)
          .join("  •  ");

        await sendReply(`╭━━━〔 📘 AJUDA DO COMANDO 〕━━━╮
┃
┃ 🟢 *${prefix}${commandName}*
┃
┃ 📝 *Função*
┃ ${command.description || "Este comando não possui descrição."}
┃
┃ ⚙️ *Como utilizar*
┃ ${command.usage || `${prefix}${commandName}`}
┃
┃ 👤 *Permissão*
┃ ${permissionLabel(type)}
┃
┃ 🔁 *Também pode ser chamado por*
┃ ${aliases}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

💚 Se precisar de outro comando, envie:
${prefix}help <nome do comando>`);
        return;
      }

      await sendReply(`❌ *Comando não encontrado*

Não encontrei o comando *${args[0]}*.

📚 Envie *${prefix}help* para consultar a lista completa.`);
      return;
    }

    let text = `╭━━━〔 📚 LISTA DE COMANDOS 〕━━━╮
┃
┃ Consulte um comando específico com:
┃ *${prefix}help <comando>*
┃
╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    for (const type of ["owner", "admin", "member"]) {
      const commands = commandImports[type];
      if (!commands?.length) continue;

      text += `╭━━━〔 ${sectionNames[type]} 〕━━━╮\n┃\n`;

      for (const command of commands) {
        const commandName = command.commands[0];
        text += `┃ 🟢 *${prefix}${commandName}*\n`;
        text += `┃    ${command.description || "Sem descrição disponível."}\n`;

        if (command.usage && command.usage !== `${prefix}${commandName}`) {
          text += `┃    ⚙️ Exemplo: ${command.usage}\n`;
        }

        text += `┃\n`;
      }

      text += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    text += `💚 *Renen • ${prefix}help*
Escolha um comando acima e peça a explicação completa.`;

    await sendReply(text);
  },
};
