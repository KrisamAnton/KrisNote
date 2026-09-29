#!/usr/bin/env bash
# KrisNote - Installations-Skript für Debian/Ubuntu.
#
# Richtet KrisNote als dauerhaften systemd-Dienst ein: installiert Node.js
# (falls nötig), klont das Repository, installiert die Abhängigkeiten und
# startet den Dienst - danach läuft KrisNote automatisch auch nach einem
# Server-Neustart weiter.
#
# Verwendung:
#   curl -fsSL https://raw.githubusercontent.com/KrisamAnton/KrisNote/main/install.sh | bash
# oder (z. B. bei einem privaten Repository, wo git nach Zugangsdaten fragt):
#   bash install.sh
#
# Einstellbar über Umgebungsvariablen (alle optional):
#   INSTALL_DIR   Zielordner (Standard: /opt/krisnote)
#   SERVICE_USER  Linux-Benutzer für den Dienst (Standard: root)
#   REPO_URL      Git-URL des Repositorys (Standard: dieses Projekt)

set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/opt/krisnote}"
SERVICE_USER="${SERVICE_USER:-root}"
REPO_URL="${REPO_URL:-https://github.com/KrisamAnton/KrisNote.git}"
NODE_MIN_MAJOR=20

# Bei "curl ... | bash" ist die Standard-Eingabe mit den Skript-Daten selbst
# belegt - ein interaktiver Login-Prompt (z. B. von "git clone" bei einem
# privaten Repository) würde sonst sofort mit einem Fehler abbrechen, statt
# auf eine Eingabe zu warten. Das hier verbindet die Standard-Eingabe wieder
# mit dem echten Terminal, falls eines vorhanden ist.
if [ -t 1 ] && [ -r /dev/tty ]; then
  exec < /dev/tty
fi

log() { printf '\n\033[1;35m▶ %s\033[0m\n' "$1"; }
die() { printf '\n\033[1;31mFehler:\033[0m %s\n' "$1" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Bitte als root ausführen (z. B. 'sudo bash install.sh')."

log "Prüfe Voraussetzungen (curl, git)"
if ! command -v curl >/dev/null 2>&1 || ! command -v git >/dev/null 2>&1; then
  apt-get update -qq
  apt-get install -y -qq curl git
fi

log "Prüfe Node.js (mindestens Version ${NODE_MIN_MAJOR})"
node_major=0
if command -v node >/dev/null 2>&1; then
  node_major="$(node -e 'console.log(process.versions.node.split(".")[0])')"
fi
if [ "$node_major" -lt "$NODE_MIN_MAJOR" ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MIN_MAJOR}.x" | bash -
  apt-get install -y -qq nodejs
fi
node --version

log "Hole KrisNote nach ${INSTALL_DIR}"
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Ordner existiert bereits und ist ein Git-Repository - hole stattdessen den neuesten Stand."
  git -C "$INSTALL_DIR" pull
elif [ -e "$INSTALL_DIR" ]; then
  die "$INSTALL_DIR existiert bereits, ist aber kein Git-Repository. Bitte INSTALL_DIR auf einen freien Pfad setzen oder den Ordner vorher entfernen."
else
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

log "Installiere Abhängigkeiten (npm install)"
(cd "$INSTALL_DIR/server" && npm install --no-fund --no-audit)

log "Richte systemd-Dienst ein"
NODE_BIN="$(command -v node)"
cat > /etc/systemd/system/krisnote.service <<EOF
[Unit]
Description=KrisNote (selbst gehostete Notizen-App)
After=network.target

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${INSTALL_DIR}/server
ExecStart=${NODE_BIN} server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now krisnote

IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
log "Fertig!"
cat <<EOF

KrisNote läuft jetzt als Dienst (startet auch nach einem Neustart automatisch).

Nächster Schritt - Einrichtungscode finden:
  journalctl -u krisnote -n 20

Danach im Browser öffnen:
  http://${IP:-<IP-dieses-Servers>}:3000/setup.html

EOF
