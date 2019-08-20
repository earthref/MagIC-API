import * as dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import axios, { AxiosInstance } from 'axios';
import waitOn from 'wait-on';
import { API } from '../api';

jest.setTimeout(15000);

describe('MagIC API - Contributions', () => {
  let api: Server;
  let client: AxiosInstance;

  beforeAll(async () => {
    client = axios.create({ baseURL: `http://localhost:${process.env.API_PORT}`, validateStatus: () => true });
    api = API.listen(process.env.API_PORT);
    await waitOn({ resources: [`tcp:localhost:${process.env.API_PORT}`] });
  });

  afterAll(() => {
    api.close();
  });

  test('GET /contributions/0 returns 204', async () => {
    const res = await client.get('/contributions/0');
    expect(res.status).toBe(204);
  });

  /*test('GET /contributions/2 returns 200', async () => {
    const res = await client.get('/contributions/2');
    expect(res.status).toBe(200);
  });*/

  test('GET /contributions/1000000000 returns 204', async () => {
    const res = await client.get('/contributions/1000000000');
    expect(res.status).toBe(204);
  });

  /*test('POST /contributions returns 201 with mocked result', async () => {
    const res = await client.post('/contributions', {});
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('contribution');
  });*/

  test('GET /contributions/1a returns 400 with validation error', async () => {
    const res = await client.get('/contributions/1a');
    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('err');
  });

});
