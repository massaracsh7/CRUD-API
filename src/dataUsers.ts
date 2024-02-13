import { User, db } from "./types";

export class DataUsers {
  private database: db;

  constructor() {
    this.database = [];
  }

  public post(user: User): User | null {
    const existingUser = this.getUser(user.id);
    if (existingUser) {
      return null;
    }
    this.database.push(user);
    return user;
  }

  public getUsers(): db {
    return [...this.database]; 
  }

  public getUser(id: string): User | null {
    return this.database.find(user => user.id === id) || null;
  }

  public put(id: string, updatedUser: User): User | null {
    const index = this.database.findIndex(user => user.id === id);
    if (index === -1) {
      return null; 
    }
    this.database[index] = { ...this.database[index], ...updatedUser };
    return this.database[index];
  }

  public delete(id: string): User | null {
    const index = this.database.findIndex(user => user.id === id);
    if (index === -1) {
      return null;
    }
    const deletedUser = this.database.splice(index, 1)[0]; 
    return deletedUser;
  }
  public clear(): void {
    this.database = [];
  }
}

export const database = new DataUsers();
  