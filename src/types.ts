export interface User {
  id: string,
  username: string,
  age: number,
  hobbies: string[]
}

export type db = User[];

export type MethodHandlers = {
  GET: () => Promise<void>;
  POST: () => Promise<void>;
  PUT: () => Promise<void>;
  DELETE: () => Promise<void>;
};

export type Method = keyof MethodHandlers;