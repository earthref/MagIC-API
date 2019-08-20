import { Context as OpenAPIContext } from 'openapi-backend/backend';
import Koa from 'koa';
import { getContributionByID } from '../server/es';

export default {
  getContributionByID: async (c: OpenAPIContext, ctx: Koa.Context) => {
    const id: string = c.request.params.id instanceof Array ? c.request.params.id[0] : c.request.params.id;
    try {
      ctx.body = await getContributionByID(id);
      if (ctx.body === undefined) {
        ctx.status = 204;
      }
    } catch (e) {
      ctx.app.emit('error', e, ctx);
    }
  },
};
