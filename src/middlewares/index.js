/**
 * Interceptadores diversos.
 */
import { delay } from "baileys";
import { OWNER_LID } from "../config.js";
import { getPrefix } from "../utils/database.js";

export function verifyPrefix(prefix, groupJid) {
  const groupPrefix = getPrefix(groupJid);
  return groupPrefix === prefix;
}

export function hasTypeAndCommand({ type, command }) {
  return !!type && !!command;
}

export async function isAdmin({ remoteJid, userLid, socket }) {
  const { participants, owner } = await socket.groupMetadata(remoteJid);

  const participant = participants.find(
    (participant) => participant.id === userLid,
  );

  if (!participant) {
    return userLid === OWNER_LID;
  }

  const isOwner = userLid === owner || participant.admin === "superadmin";

  const isAdmin = participant.admin === "admin";

  return isOwner || isAdmin;
}

export function isBotOwner({ userLid }) {
  return userLid === OWNER_LID;
}

export async function checkPermission({ type, socket, userLid, remoteJid }) {
  if (type === "member") {
    return true;
  }

  try {
    await delay(500);

    const { participants, owner } = await socket.groupMetadata(remoteJid);

    const participant = participants.find(
      (participant) => participant.id === userLid,
    );

    if (!participant) {
      return false;
    }

    const isBotOwner = userLid === OWNER_LID;

    const isOwner = userLid === owner || participant.admin === "superadmin";

    const isAdmin = isOwner || participant.admin === "admin";

    const ownerStillInGroup = participants.some(
      (participant) => participant.id === owner,
    );

    const hasSuperAdmin = participants.some(
      (participant) => participant.admin === "superadmin",
    );

    if (type === "admin") {
      return isOwner || isAdmin || isBotOwner;
    }

    if (type === "owner") {
      if (isBotOwner) {
        return true;
      }

      if (isOwner) {
        return true;
      }

      if (!ownerStillInGroup || !hasSuperAdmin) {
        return isAdmin;
      }

      return false;
    }

    return false;
  } catch (error) {
    return false;
  }
}
