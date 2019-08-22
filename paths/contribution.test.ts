import * as dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import axios, { AxiosInstance } from 'axios';
import waitOn from 'wait-on';
import { API } from '../api';

jest.setTimeout(60000);

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

  test('GET /contribution/0 returns 204', async () => {
    const res = await client.get('/contribution/0', { headers: { 'Accept': 'text/plain' }});
    expect(res.status).toBe(204);
  });

  test('GET /contribution/[latest contribution ID] returns 200', async () => {
    const latestRes = await client.get('/search/contributions?size=1');
    const latestCID = latestRes.data.results[0][0].id;
    const res = await client.get(`/contribution/${latestCID}`, { headers: { 'Accept': 'text/plain' }});
    expect(res.status).toBe(200);
  });

  test('POST /contribution returns 404', async () => {
    const res = await client.post('/contribution', {});
    expect(res.status).toBe(404);
  });

  test('GET /contribution/1a returns 400 with validation error', async () => {
    const res = await client.get('/contribution/1a', { headers: { 'Accept': 'text/plain' }});
    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('err');
  });

});
