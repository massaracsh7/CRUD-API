import { User } from "./types";
import { database } from './dataUsers';
import { ERROR_MSG, } from './constants';

const isIdExist = async (id: string) => {
  const users = await database.getUsers();
  return !!users.find(user => user.id === id);
};

const isPostValid = (data: User) => {
  const { hobbies, username, age, id } = data;
  return Object.keys(data).length === 4
    && username && age && hobbies && id
    && typeof username === 'string'
    && typeof age === 'number'
    && typeof id === 'string'
    && Array.isArray(hobbies)
    && hobbies.every(hobby => typeof hobby === 'string');
};

class UserCommand {
  async get(id?: string) {
    if (!id) {
      return database.getUsers();
    } else {
       if (!isIdExist(id)) {
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

  async put(id: string, user: User) {
    if (!id) {
      throw new Error(ERROR_MSG.INVALID_URL);
    } else if (!isIdExist(id)) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    } else {
      return await database.put(id, user);
    }
  }

  async delete(id: string) {
    if (!id) {
      throw new Error(ERROR_MSG.INVALID_URL);
    } else if (!isIdExist(id)) {
      throw new Error(ERROR_MSG.NOT_FOUND);
    } else {
      await database.delete(id);
    } 
  }
}
export const userCommand = new UserCommand();
