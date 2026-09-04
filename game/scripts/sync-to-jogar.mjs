// Copies the Vite build output (game/dist) to ../jogar (repo root), which is
// the folder actually served at /jogar/ on GitHub Pages. Vite's own outDir
// stays inside game/ (dist) so Vercel — which builds this repo with "game"
// as its project root — can find the output where it expects it.
import { cpSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const gameDir = fileURLToPath(new URL('..', import.meta.url))
const distDir = fileURLToPath(new URL('../dist', import.meta.url))
const jogarDir = fileURLToPath(new URL('../../jogar', import.meta.url))

if (existsSync(jogarDir)) {
  rmSync(jogarDir, { recursive: true, force: true })
}
cpSync(distDir, jogarDir, { recursive: true })

console.log(`Synced ${distDir.replace(gameDir, 'game/')} -> jogar/`)
