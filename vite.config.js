// Dev-only. The single plugin here adds one endpoint shared by every
// gallery harness (`public/_audio.html`, `public/_art.html`, ...): the
// child's father audits sounds/art on the iPad and marks each one ok/no,
// and those verdicts have to reach this repo. The iPad's localStorage is
// not readable from here, so the page POSTs them and the dev server writes
// the file.
//
// `configureServer` only exists while `vite dev` runs, so the production build
// is unaffected -- verified by diffing dist against a build with no config.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Whitelisted, not a raw filename from the request -- `?store=` selects one
// of these, it never becomes a path itself, so there is no traversal surface.
const STORES = {
  sound: 'sound-verdicts.json',
  art: 'art-verdicts.json',
}

function storeFile(req) {
  const url = new URL(req.url, 'http://x')
  const name = url.searchParams.get('store') || 'sound'
  return STORES[name] || STORES.sound
}

function readVerdicts(file) {
  if (!existsSync(file)) return {}
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    // A half-written file must not make the endpoint dead -- losing one
    // verdict is recoverable, refusing every future verdict is not.
    return {}
  }
}

function verdicts() {
  return {
    name: 'verdicts',
    configureServer(server) {
      server.middlewares.use('/__verdict', (req, res) => {
        const file = storeFile(req)
        if (req.method === 'GET') {
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(readVerdicts(file)))
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('POST or GET')
          return
        }
        let body = ''
        req.on('data', (c) => {
          body += c
          // A runaway client must not be able to grow this unbounded.
          if (body.length > 1e6) req.destroy()
        })
        req.on('end', () => {
          try {
            const incoming = JSON.parse(body)
            const all = readVerdicts(file)
            for (const [k, v] of Object.entries(incoming)) all[k] = v
            const dir = dirname(file)
            if (dir && dir !== '.' && !existsSync(dir)) mkdirSync(dir, { recursive: true })
            writeFileSync(file, JSON.stringify(all, null, 2) + '\n')
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ saved: Object.keys(incoming).length, total: Object.keys(all).length }))
          } catch (e) {
            res.statusCode = 400
            res.end(String(e && e.message))
          }
        })
      })
    },
  }
}

// getUserMedia (the mic-gated ATTACK feature's volume check) does not
// exist at all -- navigator.mediaDevices itself is undefined -- on a
// non-secure origin, and http://<LAN-IP>:5173 (how this dev server is
// normally reached from the iPad, see CLAUDE.md) does not qualify as one;
// only https:// and http://localhost do. Confirmed on the real device via
// ?debugaudio=1's [shout] log: `micApiPresent=false`, so every ATTACK
// silently took the mic-unavailable fallback (instant success, no actual
// volume check) -- not a bug in attemptShoutAttack() itself, the API it
// needs was simply never there to call. A self-signed cert (regenerate
// with the openssl command in this repo's session notes if the LAN IP
// changes -- .certs/ is gitignored, machine/network-specific) lets the
// iPad reach this over https:// instead; the browser will warn about the
// untrusted cert once, which is expected for a self-signed one.
const certDir = fileURLToPath(new URL('.certs/', import.meta.url))
const httpsConfig =
  existsSync(certDir + 'dev.key') && existsSync(certDir + 'dev.crt')
    ? { key: readFileSync(certDir + 'dev.key'), cert: readFileSync(certDir + 'dev.crt') }
    : undefined

// GitHub Pages serves this at /phonics-hero/, so the production build needs
// that base for every asset URL (sounds/, the hashed bundle). Only the Pages
// workflow sets it; local dev/build keep '/'. audio.js already derives
// SOUND_BASE from import.meta.env.BASE_URL, so no other code depends on it.
export default {
  base: process.env.GH_PAGES_BASE || '/',
  build: {
    rolldownOptions: {
      input: {
        game: fileURLToPath(new URL('index.html', import.meta.url)),
        review: fileURLToPath(new URL('review.html', import.meta.url)),
      },
    },
  },
  plugins: [verdicts()],
  server: { https: httpsConfig },
}
