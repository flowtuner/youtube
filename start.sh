#!/bin/bash
# Kreis der Exzellenz – Startskript
# Startet den Server und öffnet die App im Browser.

echo ""
echo "  🌠 Kreis der Exzellenz – YouTube Ad Script Generator"
echo ""

# Prüfe Node.js
if ! command -v node &> /dev/null; then
  echo "  ❌ Node.js nicht gefunden!"
  echo "  Installiere Node.js: https://nodejs.org/"
  echo ""
  exit 1
fi

# Prüfe .env
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "  ❌ Keine .env-Datei gefunden!"
  echo "  Kopiere .env.example → .env und trage deinen Anthropic API-Key ein."
  echo ""
  echo "  cp .env.example .env"
  echo "  nano .env"
  echo ""
  exit 1
fi

# Server starten
cd "$SCRIPT_DIR"
node server.js &
SERVER_PID=$!

# Warten bis Server bereit ist
sleep 1

# Browser öffnen
PORT=$(grep -E "^PORT=" .env | cut -d= -f2 | tr -d ' "'"'" || echo "3333")
[ -z "$PORT" ] && PORT=3333

if command -v open &> /dev/null; then
  open "http://localhost:$PORT"
elif command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:$PORT"
fi

echo "  Drücke Ctrl+C zum Beenden."
echo ""

# Warten auf Ctrl+C
trap "kill $SERVER_PID 2>/dev/null; echo ''; echo '  Server gestoppt.'; exit 0" INT
wait $SERVER_PID
