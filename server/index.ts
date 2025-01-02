import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get('/healthz', (c) => {
    return c.json({ message: 'Ok' });
  });

  app
  .get('/*', serveStatic({ root: './dist/static' }))
  .get('/*', serveStatic({ path: './dist/static/index.html' }));

  (async () => {
  
    const port = 3000;
    serve({ fetch: app.fetch, port }, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${port.toString()}`);
    });
  })().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
  