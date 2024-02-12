import { ERROR_MSG } from '../constants';

export const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!(uuidRegex.test(id))) {
    throw new Error(ERROR_MSG.INVALID_ID);
  }
}