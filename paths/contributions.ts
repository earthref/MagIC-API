import { Context as OpenAPIContext } from 'openapi-backend/backend';
import Koa from 'koa';

export default {
  getContributionByID: async (c: OpenAPIContext, ctx: Koa.Context) => {
    ctx.body = { operationId: c.operation.operationId };
  }
};