#!/bin/sh
# bundle src/ + three into one minified ES module (no CDN). Needs esbuild + three (npm).
cd "$(dirname "$0")/.."
NM=${NM:-/tmp/claude-0/-home-user-261126/05f56b68-50ca-5ec8-b052-6274b594f571/scratchpad/npm/node_modules}
NODE_PATH=$NM $NM/.bin/esbuild src/main.js --bundle --format=esm --minify --target=es2020 --outfile=game.js --log-level=warning --alias:three=$NM/three/build/three.module.js
