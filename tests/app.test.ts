import { app } from '../src/app';
import supertest from 'supertest';
import { database } from '../src/dataUsers';
import { getIdFromUrl } from '../src/utils/getIdFromUrl';
import { validateId } from '../src/utils/validateId';
import { validateUser } from '../src/utils/validateUser'; 

const API_ENDPOINT = '/api/users';

const server = app();
const request = supertest(server);

afterAll(async () => {
  database.clear();
  server.close();
});

describe('API Endpoint Tests', () => {
  let createdUserId = '';
  it('GET /api/users should return 200 and an empty array', async () => {
    const response = await request.get(API_ENDPOINT).set('Accept', 'aplication/json');
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual([]);
  });

  test('POST /api/users creates a new user and returns the created user', async () => {
    const newUser = {
      username: 'TestUser',
      age: 25,
      hobbies: ['coding', 'reading']
    };
    const response = await request.post(API_ENDPOINT).send(newUser).set('Accept', 'aplication/json');
    expect(response.status).toEqual(201);
    expect(JSON.parse(response.text)).toHaveProperty('id');
    createdUserId = JSON.parse(response.text).id;
    expect(JSON.parse(response.text).username).toBe(newUser.username);
    expect(JSON.parse(response.text).age).toBe(newUser.age);
    expect(JSON.parse(response.text).hobbies).toEqual(newUser.hobbies);
  });

  it('GET /api/users/{userId} should return the created user', async () => {
    const response = await request.get(`${API_ENDPOINT}/${createdUserId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toHaveProperty('id', createdUserId);
  });

  it('PUT /api/users/{userId} updates the user', async () => {
    const updatedUser = {
      username: 'UpdatedUser',
      age: 30,
      hobbies: ['coding', 'reading', 'gaming']
    };
    const response = await request.put(`${API_ENDPOINT}/${createdUserId}`).send(updatedUser).set('Accept', 'aplication/json');
    expect(response.status).toBe(200);
  });

  it('GET /api/users/{userId} should return the updated user', async () => {
    const updatedUser = {
      username: 'UpdatedUser',
      age: 30,
      hobbies: ['coding', 'reading', 'gaming']
    };
    const response = await request.get(`${API_ENDPOINT}/${createdUserId}`).set('Accept', 'aplication/json');
    expect(JSON.parse(response.text).username).toBe(updatedUser.username);
    expect(JSON.parse(response.text).age).toBe(updatedUser.age);
    expect(JSON.parse(response.text).hobbies).toEqual(updatedUser.hobbies);
  });

  it('DELETE /api/users/{userId} deletes the user', async () => {
    const response = await request.delete(`${API_ENDPOINT}/${createdUserId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(204);
  });

  it('GET /api/users/{userId} should return 404, when user was deleted', async () => {
    const getUserResponse = await request.get(`${API_ENDPOINT}/${createdUserId}`).set('Accept', 'aplication/json');
    expect(getUserResponse.status).toBe(404);
  });
});

describe('API Errors Tests', () => {
  let createdUserId = '';

  let incorrectId = '123';
  let correctId = '680b8c3a-9964-437a-bc75-e112c4213553';

  afterAll(async () => {
    database.clear();
    server.close();
  });

  it('Requests to non-existing endpoints should return 404', async () => {
    const response = await request.get('/somePath/user').set('Accept', 'aplication/json');
    expect(response.status).toEqual(404);
    expect(response.text).toBe('Invalid URL, please check');
  });

  it('POST should answer with  400 and corresponding message if request body does not contain required fields', async () => {
    const newUser = {
      username: 'TestUser',
    };
    const response = await request.post(API_ENDPOINT).send(newUser).set('Accept', 'aplication/json');
    expect(response.status).toEqual(400);
    expect(response.text).toBe('Invalid data, please check');
  });

  it('GET /api/users/{userId} should return 400 if userId is invalid', async () => {
    const response = await request.get(`${API_ENDPOINT}/${incorrectId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid id, please check');
  });
  it('Delete /api/users/{userId} should return 400 if userId is invalid', async () => {
    const response = await request.delete(`${API_ENDPOINT}/${incorrectId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid id, please check');
  });
  it('GET /api/users/{userId} should return 404 if userId doesnt exist', async () => {
    const response = await request.get(`${API_ENDPOINT}/${correctId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(404);
    expect(response.text).toBe('User is not found');
  });
  it('PUT /api/users/{userId} should return 404 if userId doesnt exist', async () => {
    const response = await request.put(`${API_ENDPOINT}/${correctId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(404);
    expect(response.text).toBe('User is not found');
  });
  it('Delete /api/users/{userId} should return 404 if userId doesnt exist', async () => {
    const response = await request.delete(`${API_ENDPOINT}/${correctId}`).set('Accept', 'aplication/json');
    expect(response.status).toBe(404);
    expect(response.text).toBe('User is not found');
  });
});

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
