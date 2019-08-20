import { Context as OpenAPIContext } from 'openapi-backend/backend';
import Koa from 'koa';
import { getSearchByTable } from '../server/es';

export default {
  getSearchByTable: async (c: OpenAPIContext, ctx: Koa.Context) => {
    const table: string = c.request.params.table instanceof Array ? c.request.params.table[0] : c.request.params.table;
    try {
      ctx.body = await getSearchByTable({ table: table === 'contributions' ? 'contribution' : table });
      if (ctx.body === undefined) {
        ctx.status = 204;
      }
    } catch (e) {
      ctx.app.emit('error', e, ctx);
    }
  },
};
