import { User } from "./types";
import { database } from './dataUsers';
import { ERROR_MSG } from './constants';
import crypto from 'crypto';

export class UserCommand {
  async get(id?: string) {
    if (!id) {
      return database.getUsers();
    } else {
        const user = await database.getUser(id);
        if (!user) {
          throw new Error(ERROR_MSG.NOT_FOUND);
        }
        return user;
    }
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
      const user = await database.getUser(id);
      if (!user) {
        throw new Error(ERROR_MSG.NOT_FOUND);
      }
    return database.put(id, updatedUser);
  }

  async delete(id: string) {
    const user = await database.getUser(id);
    if (!user) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    }
    return database.delete(id);
  }
}

function validateUser(user: User) {
  const { username, age, hobbies } = user;
  if (!(username && typeof username === 'string' && age && typeof age === 'number' && Array.isArray(hobbies))) {
    throw new Error(ERROR_MSG.INVALID_DATA);
  }
}

export const userCommand = new UserCommand();
