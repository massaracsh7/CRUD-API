import { User } from "./types";
import { validate } from 'uuid';

import { database } from './dataUsers';
import { ERROR_MSG, } from './constants';

const isIdExist = async (id: string) => {
  const users = await database.getUsers();
  return !!users.find(user => user.id === id);
};

const isPostValid = (data: User) => {
  const { hobbies, username, age } = data;
  return Object.keys(data).length === 3
    && username && age && hobbies
    && typeof username === 'string'
    && typeof age === 'number'
    && Array.isArray(hobbies)
    && hobbies.every(hobby => typeof hobby === 'string');
};

class UserCommand {
  async get(id?: string) {
    if (!id) {
      return database.getUsers();
    } else {
      if (!validate(id)) {
        throw new Error(ERROR_MSG.INVALID_ID);
      } else if (!isIdExist(id)) {
        throw new Error(ERROR_MSG.NOT_FOUND);
      } else {
        return database.getUser(id);
      }
    }
  }

  async post(newUser: User) {
    if (!isPostValid(newUser)) {
      throw new Error(ERROR_MSG.INVALID_DATA);
    } else {
      return await database.post(newUser);
    }
  }

  async put(user: User) {
    if (!user.id) {
      throw new Error(ERROR_MSG.INVALID_URL);
    } else if (!validate(user.id)) {
      throw new Error(ERROR_MSG.INVALID_ID);
    } else if (!isIdExist(user.id)) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    } else if (!isPostValid(user)) {
      throw new Error(ERROR_MSG.INVALID_DATA);
    } else {
      return await database.put(user);
    }
  }

  async delete(id: string) {
    if (!id) {
      throw new Error(ERROR_MSG.INVALID_URL);
    } else if (!validate(id)) {
      throw new Error(ERROR_MSG.INVALID_ID);
    } else if (!isIdExist(id)) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    } else {
      await database.delete(id);
    } 
  }
}
export const userCommand = new UserCommand();
