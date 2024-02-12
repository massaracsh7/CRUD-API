import { app } from '../src/app';
import supertest from 'supertest';
import { database } from '../src/dataUsers'; 

const API_ENDPOINT = '/api/users';


describe('API Endpoint Tests', () => {
  const server = app();
  const request = supertest(server);
  let createdUserId = '';

  afterAll(async () => {
    database.clear();
    server.close();
  });

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
