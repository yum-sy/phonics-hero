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

export default { plugins: [verdicts()] }
