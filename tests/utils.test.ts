import { getIdFromUrl } from '../src/utils/getIdFromUrl';
import { validateId } from '../src/utils/validateId';
import { validateUser } from '../src/utils/validateUser';

const API_ENDPOINT = '/api/users';

describe('validateUser should validate User  as objects that have username, age, hobbies', () => {
  const mockUser = {
    "username": "Mike",
    "age": 33,
    "hobbies": [
      "tennis", "books"
    ],
    "id": "b752e626-65fd-4947-bdd2-24fa8b71b5d7"
  }
  const mockUserIncorrect = {
    "username": "",
    "age": 33,
    "hobbies": [],
    "id": "b752e626-65fd-4947-bdd2-24fa8b71b5d7"
  }
  it('should return true', () => {
    const response = validateUser(mockUser);
    expect(response).toBe(true);
  });
  it('should throw error', () => {
    expect(() => validateUser(mockUserIncorrect)).toThrow('Invalid data, please check');
  });
});

describe('validateId should validate Id as uuid', () => {
  let incorrectId = '123';
  let correctId = '680b8c3a-9964-437a-bc75-e112c4213553';
  it('should return true', () => {
    const response = validateId(correctId);
    expect(response).toBe(true);
  });
  it('should throw error', () => {
    expect(() => validateId(incorrectId)).toThrow('Invalid id, please check');
  });
});

describe('getIdfromUrl should return correct Id', () => {
  let correctId = '680b8c3a-9964-437a-bc75-e112c4213553';
  let URL = 'http://localhost:4000/api/users/680b8c3a-9964-437a-bc75-e112c4213553';
  it('should return correctId', () => {
    const result = getIdFromUrl(URL);
    expect(result).toBe(correctId);
  });
});
