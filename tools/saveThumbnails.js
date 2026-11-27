// Makes the hover pictures for the furniture sidebar.
// Run it after adding or changing a catalogue item:   npm run thumbnails
//
// It starts a Vite server, opens tools/thumbnails.html in headless Chrome
// (through the Chrome DevTools protocol), waits for the page to render every
// item, and writes the pictures to public/thumbnails/<item id>.webp.
// Set CHROME to Chrome's path if it is not installed in the usual place.

import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'

const chromePath = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const server = await createServer({ server: { port: 5198, strictPort: true } })
await server.listen()

const chrome = spawn(chromePath, [
  '--headless=new',
  '--use-angle=swiftshader', // software WebGL, works without a graphics card
  '--enable-unsafe-swiftshader',
  '--remote-debugging-port=9334',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'thumbs-'))}`,
  'about:blank',
])

// wait for Chrome to open its debugging port and find its tab
let tab
for (let i = 0; i < 50 && !tab; i++) {
  await sleep(300)
  try {
    const tabs = await (await fetch('http://127.0.0.1:9334/json')).json()
    tab = tabs.find((t) => t.type === 'page')
  } catch {
    // not ready yet
  }
}

const socket = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve))
let nextId = 0
const waiting = {}
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  waiting[message.id]?.(message.result)
})
const send = (method, params = {}) =>
  new Promise((resolve) => {
    waiting[++nextId] = resolve
    socket.send(JSON.stringify({ id: nextId, method, params }))
  })
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true }))?.result?.value

await send('Page.navigate', { url: 'http://localhost:5198/tools/thumbnails.html' })

// the page sets its title to "done" (or "error: ...") when it has finished
let title = ''
for (let i = 0; i < 600 && title !== 'done' && !title.startsWith('error'); i++) {
  await sleep(500)
  title = (await evaluate('document.title')) || ''
}

if (title === 'done') {
  const pictures = await evaluate('window.pictures')
  mkdirSync('public/thumbnails', { recursive: true })
  for (const [id, dataUrl] of Object.entries(pictures)) {
    writeFileSync(`public/thumbnails/${id}.webp`, Buffer.from(dataUrl.split(',')[1], 'base64'))
  }
  console.log(`Saved ${Object.keys(pictures).length} pictures to public/thumbnails`)
} else {
  console.error('Could not make the pictures:', title || 'timed out')
}

socket.close()
chrome.kill()
await server.close()
process.exit(title === 'done' ? 0 : 1)
