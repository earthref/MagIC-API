import { spawn, ChildProcess } from 'child_process';
import axios, { AxiosInstance } from 'axios';
import waitOn from 'wait-on';

jest.setTimeout(15000);

describe('MagIC API - Contributions', () => {
  let start: ChildProcess;
  let client: AxiosInstance;

  beforeAll(async () => {
    client = axios.create({ baseURL: 'http://localhost:8080', validateStatus: () => true });
    start = spawn('npm', ['start'], { cwd: __dirname, detached: true });
    await waitOn({ resources: ['tcp:localhost:8080'] });
  });

  afterAll(() => process.kill(-start.pid));

  test('GET /contributions/1 returns 200 with mocked result', async () => {
    const res = await client.get('/contributions/1');
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ });
  });

  test('POST /contributions returns 201 with mocked result', async () => {
    const res = await client.post('/contributions', {});
    expect(res.status).toBe(201);
    expect(res.data).toEqual({ });
  });

  test('GET /contributions/1a returns 400 with validation error', async () => {
    const res = await client.get('/contributions/1a');
    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('err');
  });

  test('GET /unknown returns 404', async () => {
    const res = await client.get('/unknown');
    expect(res.status).toBe(404);
    expect(res.data).toHaveProperty('err');
  });
});
