import { app } from '../src/app';
import supertest from 'supertest';
import { database } from '../src/dataUsers';

const API_ENDPOINT = '/api/users';

describe('API Errors Tests', () => {
 
  const server = app();
  const request = supertest(server);
  let createdUserId = '';

  afterAll(async () => {
    database.clear();
    server.close();
  });
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
