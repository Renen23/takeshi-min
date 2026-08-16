import fs from "node:fs";
import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../config.js";
import { getNextKitten, menuMessage } from "../../menu.js";

export default {
  name: "menu",
  description: "Menu de comandos",
  commands: ["menu", "help"],
  usage: `${PREFIX}menu`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ remoteJid, sendSuccessReact, sendImageFromFile }) => {
    await sendSuccessReact();

    let imagePath = getNextKitten();

    if (!fs.existsSync(imagePath)) {
      imagePath = path.join(ASSETS_DIR, "images", "takeshi-bot.png");
    }

    await sendImageFromFile(imagePath, `\n\n${menuMessage(remoteJid)}`);
  },
};
