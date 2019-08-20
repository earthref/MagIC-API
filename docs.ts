import Koa from 'koa';
import KoaStatic from 'koa-static';

const Docs = new Koa();
Docs.use(KoaStatic('docs'));
export { Docs };
