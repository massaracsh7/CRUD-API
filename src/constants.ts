export const enum STATUS {
  SUCCESS = 200,
  CREATED = 201,
  DELETED = 204,
  INVALID = 400,
  NOT_FOUND = 404,
  ERROR = 500
}

export const enum ERROR_MSG {
  SERVER_ERROR = 'Error on server',
  NOT_FOUND = 'User is not found',
  INVALID_DATA = 'Invalid data',
  INVALID_ID = 'Invalid id',
  INVALID_URL = 'Invalid url',
}

export const API_BASE_URL = '/api/users';

export type MethodHandlers = {
  GET: () => Promise<void>;
  POST: () => Promise<void>;
  PUT: () => Promise<void>;
  DELETE: () => Promise<void>;
};

export type Method = keyof MethodHandlers;