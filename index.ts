import path from 'path';
import OpenAPIBackend from 'openapi-backend';
import { Context as OpenAPIContext } from 'openapi-backend/backend';
import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import KoaStatic from 'koa-static';

import contributions from './paths/contributions';

const app = new Koa();
app.use(KoaBodyparser());

// define api
const api = new OpenAPIBackend({
  definition: path.join(__dirname, '..', 'docs', 'openapi.yml'),
  handlers: {
    ... contributions,
    validationFail: async (c: OpenAPIContext, ctx: Koa.Context) => {
      ctx.body = { err: c.validation.errors };
      ctx.status = 400;
    },
    notFound: async (c: OpenAPIContext, ctx: Koa.Context) => {
      ctx.body = { err: 'not found' };
      ctx.status = 404;
    },
    notImplemented: async (c: OpenAPIContext, ctx: Koa.Context) => {
      const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
      ctx.body = mock;
      ctx.status = status;
    }
  }
});

api.init();

// use as koa middleware
app.use((ctx) =>
  api.handleRequest(
    {
      method: ctx.request.method,
      path: ctx.request.path,
      body: ctx.request.body,
      query: ctx.request.query,
      headers: ctx.request.headers,
    },
    ctx,
  ),
);

// start API server
app.listen(3100, () => console.info('API listening at http://localhost:3100'));

// start Docs server
const docs = new Koa();
docs.use(KoaStatic('docs'));
docs.listen(3101, () => console.info('Docs listening at http://localhost:3101'));