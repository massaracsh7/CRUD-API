import { User } from "./types";
import { database } from './dataUsers';
import { ERROR_MSG } from './constants';
import crypto from 'crypto';
import { validateUser } from "./utils/validateUser";
import { validateId } from "./utils/validateId";

export class UserCommand {
  async get(id?: string) {
    if (!id) {
      return database.getUsers();
    } else {
      validateId(id);
    }
    const user = await database.getUser(id);
    if (!user) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    }
    return user;
  }

  async post(dataUser: User) {
    validateUser(dataUser);
    const uuid = crypto.randomUUID({ disableEntropyCache: true })
    const newUser = {
      ...dataUser,
      id: uuid
    }
    return database.post(newUser);
  }

  async put(id: string, updatedUser: User) {
    validateUser(updatedUser);
    validateId(id);
    const user = await database.getUser(id);
    if (!user) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    }
    return database.put(id, updatedUser);
  }

  async delete(id: string) {
    validateId(id);
    const user = await database.getUser(id);
    if (!user) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    }
    return database.delete(id);
  }
}

export const userCommand = new UserCommand();
