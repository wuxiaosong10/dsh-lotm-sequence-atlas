import { readFileSync } from 'node:fs';

export const name = 'dsh-lotm-sequence-atlas';
export const inject = ['webServer'];
const ASSET_PREFIX = '/api/lotm-sequence-atlas/assets/';

/** Fixed routes only; the request URL never becomes a filesystem path. */
export function createAssetRoutes({ read = readFileSync } = {}) {
  const filenames = Array.from({ length: 10 }, (_, n) => 9 - n).flatMap((seq) =>
    ['sequence', 'thumb'].map((kind) => `${kind}-${seq}.webp`));
  filenames.push('sequence-8-light.webp','thumb-8-light.webp','ornaments/pillar-fog-slim.png');
  for (let seq = 9; seq >= 0; seq--) filenames.push(`videos/sequence-${seq}.mp4`);
  return filenames.map((filename) => {
      const file = new URL('../assets/' + filename, import.meta.url);
      const video = filename.endsWith('.mp4');
      return {
        kind: 'exact', path: ASSET_PREFIX + filename,
        handler(req, res) {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
          }
          try {
            const body = read(file);
            const headers = { 'content-type': video ? 'video/mp4' : filename.endsWith('.png') ? 'image/png' : 'image/webp', 'content-length': body.length,
              'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' };
            if (video) headers['accept-ranges'] = 'bytes';
            const range = req.method === 'GET' && video ? req.headers?.range : undefined;
            if (range !== undefined) {
              const match = typeof range === 'string' && /^bytes=(\d*)-(\d*)$/.exec(range);
              let start, end;
              if (match && (match[1] || match[2])) {
                if (!match[1]) {
                  const suffix = Number(match[2]);
                  if (Number.isSafeInteger(suffix) && suffix > 0) { start = Math.max(0,body.length-suffix); end = body.length-1; }
                } else {
                  start = Number(match[1]); end = match[2] ? Number(match[2]) : body.length-1;
                }
              }
              if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= body.length || end < start) {
                res.writeHead(416,{...headers,'content-length':0,'content-range':`bytes */${body.length}`}); res.end(); return;
              }
              end = Math.min(end,body.length-1);
              res.writeHead(206,{...headers,'content-length':end-start+1,'content-range':`bytes ${start}-${end}/${body.length}`});
              res.end(body.subarray(start,end+1)); return;
            }
            res.writeHead(200,headers); res.end(req.method === 'HEAD' ? undefined : body);
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
  }, 'lotm-sequence-atlas: local background media');
}
