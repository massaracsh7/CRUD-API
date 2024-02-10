import { User, db } from "./types";

export class DataUsers {
  private database: db;

  constructor() {
    this.database = [];
  }

  public post(user: User): User | null {
    if (this.database.some((item: User) => item.id === user.id)) {
      return null;
    }
    this.database.push(user);
    return user;
  }

  public getUsers(): db {
    return this.database;
  }

  public getUser(id: string): User | null {
    return this.database.find((user: User) => user.id === id) ?? null;
  }

  public put(updatedUser: User): User | null {
    const userToUpdate = this.database.find((item: User) => item.id === updatedUser.id);
    if (!userToUpdate) return null;
    Object.assign(userToUpdate, updatedUser);
    return userToUpdate;
  }

  public delete(id: string | number): User | null {
    const userToDelete = this.database.find((user: User) => user.id === id);
    if (!userToDelete) return null;
    this.database = this.database.filter((user: User) => user.id !== id);
    return userToDelete;
  }
}

export const database = new DataUsers();
