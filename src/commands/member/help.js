import { PREFIX } from "../../config.js";
import { formatCommand, readCommandImports } from "../../utils/index.js";

const sectionNames = {
  owner: "👑 DONO DO BOT",
  admin: "🔐 ADMINISTRAÇÃO",
  member: "✅ COMANDOS GERAIS",
};

function permissionLabel(type) {
  if (type === "owner") return "👑 Apenas o dono";
  if (type === "admin") return "🔐 Dono e administradores autorizados";
  return "✅ Utilizadores autorizados";
}

function primaryName(command) {
  return command.commands?.[0] || command.name || "comando";
}

function uniqueCommands(commands) {
  const seen = new Set();
  return commands.filter((command) => {
    const key = formatCommand(primaryName(command));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function commandLine(command, prefix) {
  const name = primaryName(command);
  const description = command.description || "Sem descrição disponível.";
  return `┃ 🟢 *${prefix}${name}* — ${description}`;
}

export default {
  name: "help",
  description: "Lista todos os comandos ou explica um comando específico.",
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

        const commandName = primaryName(command);
        const aliases = (command.commands || [])
          .map((alias) => `${prefix}${alias}`)
          .join("  •  ");

        await sendReply(`╭━━━〔 📘 EXPLICAÇÃO DO COMANDO 〕━━━╮
┃
┃ 🟢 *${prefix}${commandName}*
┃
┃ 📝 *O que faz*
┃ ${command.description || "Este comando não possui descrição."}
┃
┃ ⚙️ *Como usar*
┃ ${command.usage || `${prefix}${commandName}`}
┃
┃ 👤 *Quem pode usar*
┃ ${permissionLabel(type)}
┃
┃ 🔁 *Também funciona como*
┃ ${aliases}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`);
        return;
      }

      await sendReply(`❌ *Comando não encontrado*

Não encontrei o comando *${args[0]}*.

📚 Use *${prefix}help* para listar todos os comandos.`);
      return;
    }

    const sections = [];
    let total = 0;

    for (const type of ["owner", "admin", "member"]) {
      const commands = uniqueCommands(commandImports[type] || []);
      if (!commands.length) continue;

      total += commands.length;
      sections.push(`╭━━━〔 ${sectionNames[type]} 〕━━━╮
┃
${commands.map((command) => commandLine(command, prefix)).join("\n")}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }

    await sendReply(`╭━━━〔 📚 LISTA COMPLETA — RENEN BOT 〕━━━╮
┃
┃ 🧩 Total: ${total} comandos
┃
┃ Para explicar um comando específico:
┃ *${prefix}help <comando>*
┃ Exemplo: ${prefix}help antifake
┃
╰━━━━━━━━━━━━━━━━━━━━╯

${sections.join("\n\n")}

💚 *Renen Bot* • Todos os comandos estão listados acima.`);
  },
};
