// Dev-only. The single plugin here adds one endpoint used by the sound gallery
// (`public/_audio.html`): the child's father auditions each phoneme on the
// iPad and marks it ok/no, and those verdicts have to reach this repo. The
// iPad's localStorage is not readable from here, so the page POSTs them and
// the dev server writes the file.
//
// `configureServer` only exists while `vite dev` runs, so the production build
// is unaffected -- verified by diffing dist against a build with no config.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const VERDICT_FILE = 'sound-verdicts.json'

function readVerdicts() {
  if (!existsSync(VERDICT_FILE)) return {}
  try {
    return JSON.parse(readFileSync(VERDICT_FILE, 'utf8'))
  } catch (e) {
    // A half-written file must not make the endpoint dead -- losing one
    // verdict is recoverable, refusing every future verdict is not.
    return {}
  }
}

function soundVerdicts() {
  return {
    name: 'sound-verdicts',
    configureServer(server) {
      server.middlewares.use('/__verdict', (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(readVerdicts()))
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
            const all = readVerdicts()
            for (const [k, v] of Object.entries(incoming)) all[k] = v
            const dir = dirname(VERDICT_FILE)
            if (dir && dir !== '.' && !existsSync(dir)) mkdirSync(dir, { recursive: true })
            writeFileSync(VERDICT_FILE, JSON.stringify(all, null, 2) + '\n')
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

export default { plugins: [soundVerdicts()] }
