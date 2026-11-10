#!/bin/bash
set -e
cd "$(dirname "$0")"
LIVE='https://binland23.github.io/fair-blocks/'
if [ "${1:-}" != '--local' ] && curl --silent --fail --max-time 5 --output /dev/null "$LIVE"; then
  if command -v open >/dev/null; then open "$LIVE"; else xdg-open "$LIVE"; fi
  exit 0
fi
PORT=8778
URL="http://127.0.0.1:$PORT/"
if curl --silent --fail --max-time 1 --output /dev/null "$URL"; then
  if command -v open >/dev/null; then open "$URL"; else xdg-open "$URL"; fi
  exit 0
fi
if ! command -v python3 >/dev/null; then
  if command -v open >/dev/null; then open "$PWD/index.html"; else xdg-open "$PWD/index.html"; fi
  exit 0
fi
printf 'Fair Blocks is running locally. Keep this window open while playing.\n'
python3 - "$PORT" <<'PYTHON'
import http.server, sys, webbrowser
port = int(sys.argv[1])
server = http.server.ThreadingHTTPServer(('127.0.0.1', port), http.server.SimpleHTTPRequestHandler)
webbrowser.open(f'http://127.0.0.1:{port}/')
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
PYTHON
