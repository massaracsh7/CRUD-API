import { ERROR_MSG } from '../constants';
import { User } from '../types';


export const validateUser = (user: User) => {
  const { username, age, hobbies } = user;
  if (!(username && typeof username === 'string' && age && typeof age === 'number' && Array.isArray(hobbies))) {
    throw new Error(ERROR_MSG.INVALID_DATA);
  }
}
