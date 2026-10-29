import { readFileSync } from 'node:fs';

export const name = 'dsh-lotm-sequence-atlas';
export const inject = ['webServer'];
const ASSET_PREFIX = '/api/lotm-sequence-atlas/assets/';

/** Fixed routes only; the request URL never becomes a filesystem path. */
export function createAssetRoutes({ read = readFileSync } = {}) {
  const filenames = Array.from({ length: 10 }, (_, n) => 9 - n).flatMap((seq) =>
    ['sequence', 'thumb'].map((kind) => `${kind}-${seq}.webp`));
  filenames.push('sequence-8-light.webp','thumb-8-light.webp','ornaments/pillar-fog-slim.png');
  return filenames.map((filename) => {
      const file = new URL('../assets/' + filename, import.meta.url);
      return {
        kind: 'exact', path: ASSET_PREFIX + filename,
        handler(req, res) {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
          }
          try {
            const body = read(file);
            res.writeHead(200, { 'content-type': filename.endsWith('.png') ? 'image/png' : 'image/webp', 'content-length': body.length,
              'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' });
            res.end(req.method === 'HEAD' ? undefined : body);
          } catch {
            res.writeHead(404, { 'cache-control': 'no-store' }); res.end();
          }
        },
      };
    });
}

export function apply(ctx) {
  ctx.effect(() => {
    const disposers = [];
    try { for (const route of createAssetRoutes()) disposers.push(ctx.webServer.register(route)); }
    catch (error) { for (const dispose of disposers.reverse()) dispose(); throw error; }
    return () => { for (const dispose of disposers.reverse()) dispose(); };
  }, 'lotm-sequence-atlas: local images');
}
