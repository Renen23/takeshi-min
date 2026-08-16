/**
 * Interceptadores diversos.
 */
import { delay } from "baileys";
import { OWNER_LID } from "../config.js";
import { getPrefix } from "../utils/database.js";
import { onlyNumbers } from "../utils/index.js";

export function verifyPrefix(prefix, groupJid) {
  const groupPrefix = getPrefix(groupJid);
  return groupPrefix === prefix;
}

export function hasTypeAndCommand({ type, command }) {
  return !!type && !!command;
}

export async function isAdmin({ remoteJid, userLid, socket }) {
  const { participants, owner } = await socket.groupMetadata(remoteJid);

  const userNumber = onlyNumbers(userLid);
  const ownerNumber = onlyNumbers(OWNER_LID);

  if (userNumber === ownerNumber) {
    return true;
  }

  const participant = participants.find(
    (participant) => onlyNumbers(participant.id) === userNumber,
  );

  if (!participant) {
    return false;
  }

  const isOwner = onlyNumbers(participant.id) === onlyNumbers(owner) ||
    participant.admin === "superadmin";

  const isAdmin = participant.admin === "admin";

  return isOwner || isAdmin;
}

export function isBotOwner({ userLid }) {
  return onlyNumbers(userLid) === onlyNumbers(OWNER_LID);
}

export async function checkPermission({ type, socket, userLid, remoteJid }) {
  if (type === "member") {
    return true;
  }

  try {
    await delay(500);

    const { participants, owner } = await socket.groupMetadata(remoteJid);

    const userNumber = onlyNumbers(userLid);
    const ownerNumber = onlyNumbers(OWNER_LID);
    const groupOwnerNumber = onlyNumbers(owner);

    if (userNumber === ownerNumber) {
      return true;
    }

    const participant = participants.find(
      (participant) => onlyNumbers(participant.id) === userNumber,
    );

    if (!participant) {
      return false;
    }

    const isOwner = onlyNumbers(participant.id) === groupOwnerNumber ||
      participant.admin === "superadmin";

    const isAdmin = isOwner || participant.admin === "admin";

    const ownerStillInGroup = participants.some(
      (participant) => onlyNumbers(participant.id) === groupOwnerNumber,
    );

    const hasSuperAdmin = participants.some(
      (participant) => participant.admin === "superadmin",
    );

    if (type === "admin") {
      return isOwner || isAdmin;
    }

    if (type === "owner") {
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
