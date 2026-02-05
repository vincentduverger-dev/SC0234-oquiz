import z from "zod";
import { ConflictError, NotFoundError } from "./errors.ts";
import { prisma } from "../models/index.ts";

export function isValidPassword(password: string) {
  //  Idée de validations pour un mot de passe:

  //  - Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  //  - Un caractère spéciale
  if (!/[!@#$%^&*(),.?":{}|<>;'`~]/.test(password)) {
    return false;
  }

  //  - Au moins un nombre
  if (!/[0-9]/.test(password)) {
    return false;
  }

  //  - Entre 12 et 24 caractères
  if (password.length < 12 || password.length > 24) {
    return false;
  }

  return true;
}

export const passwordSchema = z.string().min(8, "Veuillez entrer un mdp de minimum 8 caractères").max(30, "Veuillez entrer un mdp de maximum 30 caractères").regex(/[a-z]/, "password should contain at least a lowercase caracter").regex(/[A-Z]/, "password should contain at least a uppercase caracter").regex(/[0-9]/, "password should contain at least a number")

export const assertUniqueTagName = async (name: string) => {
  const alreadyTakenName = !! await prisma.tag.count({ where: { name } });
  if (alreadyTakenName) { throw new ConflictError("Tag name is already taken"); }
}

export const assertParentTagExistsWhenProvided = async (parent_tag_id?: number) => {
  if (!parent_tag_id) { return; }

  const parentTag = await prisma.tag.findUnique({ where: { id: parent_tag_id } });
  if (!parentTag) { throw new NotFoundError(`Parent tag ${parent_tag_id} does not exist`); }
}