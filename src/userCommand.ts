import { User } from "./types";

class UserCommand {
  async get(id?: string) {
    return id;
  }

  async post(newUser: User) {
    return newUser;
  }

  async put(user: User) {
    return user;
  }

  async delete(id: string) {
    return id
  }
}
export const userCommand = new UserCommand();
