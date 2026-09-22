import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Stamp public/sw.js with a version that changes on every deploy.
//
// The service worker's activate handler deletes every cache whose name differs
// from the current CACHE_NAME. With a hard-coded name ('dog-planner-v1') that
// condition was never true, so no cache was ever purged and a user could be
// pinned to an old bundle. Vercel exposes VERCEL_GIT_COMMIT_SHA at build time,
// which is stable per deploy and unique across deploys; local builds fall back
// to a timestamp.
function swVersion(): Plugin {
  return {
    name: 'sw-version',
    apply: 'build',
    closeBundle() {
      const out = resolve(__dirname, 'dist/sw.js')
      if (!existsSync(out)) return
      const version =
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? `local-${Date.now()}`
      const src = readFileSync(out, 'utf8')
      if (!src.includes('__SW_VERSION__')) {
        this.warn('sw.js has no __SW_VERSION__ placeholder - cache will not version')
        return
      }
      writeFileSync(out, src.replace(/__SW_VERSION__/g, version))
      this.info?.(`sw.js cache stamped: dog-planner-${version}`)
    },
  }
}

export default defineConfig({
  plugins: [react(), swVersion()],
})
