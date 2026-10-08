# KrisNote

**Aktuelle Version:** 1.7.12 (Testphase) - siehe [CHANGELOG.md](CHANGELOG.md)

## Was ist KrisNote

KrisNote ist eine selbst gehostete Notizen-App - eine Alternative zu
OneNote/Apple Notes, bei der Notizen beliebig tief verschachtelte
Unterseiten haben können. Text, Bilder, PDFs und Handschrift lassen sich
frei auf einer Zeichenfläche platzieren. KrisNote läuft komplett auf dem
eigenen Server - es gibt keine Cloud-Anbindung an einen fremden Anbieter,
alle Daten bleiben bei dir.

> Screenshots folgen hier.

## Voraussetzungen

- Ein Linux-Server, eine VM oder ein LXC-Container, der dauerhaft läuft
  (z. B. Debian oder Ubuntu). Proxmox ist ein mögliches Beispiel für die
  Virtualisierung, aber keine Voraussetzung - jeder Linux-Rechner mit
  Node.js funktioniert.
- **Node.js Version 20 oder neuer.** (Diese Anforderung kommt von einer der
  verwendeten Bibliotheken, `nodemailer`, die Node.js 20+ voraussetzt.)
- **Für die Sprachnotiz-Transkription (optional, nur falls gewünscht):**
  zusätzlich Python 3 mit den Paketen aus `server/requirements.txt`
  (`faster-whisper`, `pyannote.audio`) sowie `torch`. Ohne diese
  Installation funktioniert KrisNote ganz normal - nur der Knopf "In Text
  umwandeln" bei Sprachaufnahmen bleibt dann ohne Wirkung.

## Installation

**Am einfachsten: Installations-Skript** (Debian/Ubuntu, als root). Installiert
Node.js falls nötig, klont das Repository nach `/opt/krisnote`, führt
`npm install` aus und richtet KrisNote gleich als systemd-Dienst ein (läuft
danach dauerhaft, auch nach einem Server-Neustart):

```bash
apt-get update && apt-get install -y curl && curl -fsSL https://raw.githubusercontent.com/KrisamAnton/KrisNote/main/install.sh | bash
```

(Der erste Teil installiert `curl`, falls es noch fehlt - auf frischen
Debian-Containern ist das oft der Fall. Ist `curl` schon da, schadet er nicht.)

Am Ende zeigt das Skript die Adresse an. Den Einrichtungscode für den ersten
Start findest du mit `journalctl -u krisnote -n 20`.

Falls der Einzeiler bei dir nicht durchläuft, geht es auch in zwei Schritten
(erst die Datei holen, dann ausführen):

```bash
curl -fsSL -o install.sh https://raw.githubusercontent.com/KrisamAnton/KrisNote/main/install.sh
bash install.sh
```

Zielordner und Dienst-Benutzer lassen sich davor per Umgebungsvariable
anpassen, z. B. `INSTALL_DIR=/srv/krisnote bash install.sh`.

**Von Hand** (falls man mehr Kontrolle möchte, oder das Skript nicht passt):

```bash
git clone https://github.com/KrisamAnton/KrisNote.git KrisNote
cd KrisNote/server
npm install
```

Dauerhaft als Dienst starten (systemd): Im Ordner `deploy/` liegt eine
Vorlage-Datei (`krisnote.service`). Sie kopieren, die Platzhalter (Pfad,
Benutzername) anpassen und einrichten:

```bash
sudo cp deploy/krisnote.service /etc/systemd/system/krisnote.service
sudo nano /etc/systemd/system/krisnote.service   # Platzhalter anpassen
sudo systemctl daemon-reload
sudo systemctl enable --now krisnote
```

Die Vorlage-Datei selbst enthält weitere Erklärungen als Kommentare.

**Nur zum kurzen Ausprobieren** (läuft, bis das Terminal-Fenster
geschlossen wird):

```bash
cd KrisNote/server
npm start
```

Der Server ist danach standardmäßig unter `http://<server-adresse>:3000`
erreichbar.

## Erster Start

Direkt nach der Installation (noch kein Benutzer vorhanden) ist die App im
Einrichtungsmodus:

1. Server starten (siehe oben).
2. Im Server-Log nach der Zeile `Einrichtungscode:` suchen:
   - Bei einem systemd-Dienst: `journalctl -u krisnote -n 50`
   - Sonst: direkt im Terminal-Fenster, in dem der Server gestartet wurde
3. Im Browser `http://<server-adresse>:3000/setup.html` öffnen
   (`/login.html` leitet automatisch dorthin um, solange noch kein
   Benutzer existiert).
4. Einrichtungscode, gewünschten Benutzernamen, optional einen
   Anzeigenamen und ein Passwort (mind. 8 Zeichen) eingeben. Man ist
   danach sofort angemeldet.
5. Sobald dieser erste Benutzer existiert, ist `/setup.html` dauerhaft
   gesperrt - ein erneuter Aufruf leitet nur noch zu `/login.html` um.

Nach 5 falschen Einrichtungscode-Eingaben ist die Einrichtung für 15
Minuten gesperrt (Schutz gegen Erraten des Codes durch Dritte im selben
Netzwerk).

## Version sehen

Die installierte Version steht dezent in den Einstellungen der App (Klick
auf den eigenen Benutzernamen unten links) sowie unten auf der
Anmeldeseite, und lässt sich auch direkt abrufen:

```bash
curl http://<server-adresse>:3000/api/version
```

Neue Versionen werden in [CHANGELOG.md](CHANGELOG.md) mit ihren Änderungen
aufgelistet und als Git-Tag (z. B. `v1.7.12`) im Repository markiert.

## Einstellungen per Umgebungsvariable

Alle Variablen sind optional - ohne sie gelten die Standardwerte. Sie
lassen sich beim Start setzen (z. B. `PORT=3000 npm start`) oder als
`Environment=`-Zeile im systemd-Dienst (siehe `deploy/krisnote.service`).

| Variable | Standardwert | Erklärung |
|---|---|---|
| `PORT` | `3000` | Port, auf dem der Server erreichbar ist. |
| `DATA_DIR` | `<Installationsordner>/data` | Ordner für Benutzerkonten, Notizen und hochgeladene Dateien. |
| `ALLOW_REGISTRATION` | aus | Auf `true` setzen, damit sich beliebige Personen über die Anmeldeseite selbst einen Zugang anlegen können. Standardmäßig aus - weitere Benutzer legt man sonst per Kommandozeile an (siehe unten). |
| `SETUP_CODE` | zufällig erzeugt | Erlaubt, den Einrichtungscode für den allerersten Start fest vorzugeben, statt ihn zufällig erzeugen und im Log ausgeben zu lassen. |
| `TRUST_PROXY` | aus | Nur nötig, wenn KrisNote **hinter einem Reverse-Proxy** läuft (z. B. Cloudflare Tunnel, nginx, Caddy). Wert: Anzahl der vorgeschalteten Proxys (meist `1`) oder die Adresse des Proxys (z. B. `10.0.0.5` oder `loopback`). Siehe Abschnitt "Fernzugriff". |
| `PYTHON_BIN` | `python3` | Pfad zum Python-Interpreter für die Transkription (z. B. bei Verwendung eines eigenen venv). |
| `WHISPER_MODEL` | `medium` | Modellgröße für die Spracherkennung (`small` ist schneller, aber etwas ungenauer). |
| `TRANSCRIBE_LANGUAGE` | `de` | Sprache, die die Transkription erwartet. |
| `HF_TOKEN` | leer | Hugging-Face-Zugriffstoken für die Sprechererkennung bei Transkriptionen (optional). Ohne Token wird nur der reine Text erkannt (ein Sprecher). |

**Weitere Benutzer per Kommandozeile anlegen** (unabhängig von
`ALLOW_REGISTRATION` immer möglich):

```bash
node server/create-user.js <benutzername> <passwort> [Anzeigename]
```

## Update

1. **Vorher immer ein Backup von `data/` anlegen** (siehe Abschnitt
   "Backup" unten).
2. Neuen Code holen und Abhängigkeiten aktualisieren:
   ```bash
   cd KrisNote
   git pull
   cd server
   npm install   # nur nötig, falls sich Abhängigkeiten geändert haben
   ```
3. Dienst neu starten:
   ```bash
   sudo systemctl restart krisnote
   ```

Der `data/`-Ordner ist nicht Teil des Repositorys (siehe `.gitignore`) und
wird von `git pull` nie angerührt oder überschrieben.

## Backup

Der komplette Datenbestand (Benutzerkonten, alle Notizen, hochgeladene
Bilder/PDFs/Aufnahmen, Erinnerungs-Mail-Einstellungen) liegt ausschließlich
im `data/`-Ordner (Pfad über `DATA_DIR` änderbar, siehe oben). Diesen Ordner
regelmäßig sichern, z. B.:

```bash
tar -czf krisnote-backup-$(date +%F).tar.gz -C KrisNote data
```

Für ein garantiert konsistentes Backup den Dienst währenddessen kurz
stoppen (`sudo systemctl stop krisnote`, nach dem Backup wieder
`sudo systemctl start krisnote`) - im laufenden Betrieb sichern funktioniert
in der Praxis aber ebenfalls, da Schreibvorgänge atomar sind.

## Fernzugriff (optional)

KrisNote selbst bringt keinen fertigen Fernzugriff von außerhalb des
eigenen Netzwerks mit. Gängige Möglichkeiten, KrisNote trotzdem von
unterwegs zu erreichen:

- Nur im eigenen Heimnetz nutzen (kein Fernzugriff nötig).
- Ein VPN zum eigenen Netzwerk (z. B. Tailscale, WireGuard).
- Ein Tunnel-Dienst wie Cloudflare Tunnel, der eine eigene Domain
  (z. B. `notizen.meine-domain.example`) nach außen freigibt, ohne einen
  Port am Router öffnen zu müssen.

**Wichtig, falls KrisNote von außerhalb des eigenen Netzwerks erreichbar
gemacht wird:** `ALLOW_REGISTRATION` ausgeschaltet lassen (Standard) und
den Zugriff über HTTPS absichern (z. B. übernimmt Cloudflare Tunnel das
automatisch) - sonst kann sich potenziell jeder im Internet einen Zugang
anlegen bzw. Zugangsdaten könnten unverschlüsselt übertragen werden. Eine
Schritt-für-Schritt-Anleitung für eine bestimmte Lösung ist hier bewusst
nicht enthalten, da das von der eigenen Netzwerk-Umgebung abhängt.

**Läuft KrisNote hinter einem Proxy oder Tunnel (z. B. Cloudflare Tunnel),
bitte `TRUST_PROXY=1` setzen** (z. B. als `Environment=TRUST_PROXY=1` im
systemd-Dienst, siehe `deploy/krisnote.service`). Ohne diese Einstellung sieht
der Server bei jeder Anfrage nur die Adresse des Proxys: Die Sperre nach
Fehlversuchen trifft dann alle Besucher gemeinsam (jemand von außen könnte
dein Konto durch absichtliche Fehlversuche kurz sperren), und die
Anmelde-Cookies werden nicht als "Secure" markiert. Ohne Proxy (direkter
Zugriff) die Einstellung **nicht** setzen - sonst ließe sich die Adresse
durch einen mitgeschickten Header fälschen.

## Projekt unterstützen

KrisNote ist und bleibt kostenlos. Wenn es dir gefällt und du die Arbeit
dahinter honorieren möchtest, freue ich mich über eine freiwillige Spende:
[paypal.me/KrisamKreativStudio](https://www.paypal.me/KrisamKreativStudio).
Der Link steht auch in der App unter Einstellungen.

## Lizenz

KrisNote steht unter der **MIT-Lizenz** (siehe [LICENSE](LICENSE)): Du darfst es
kostenlos nutzen, verändern und weitergeben - auch geschäftlich. Der
Urheber-Hinweis und der Lizenztext müssen dabei erhalten bleiben. Das Programm
wird ohne jede Gewährleistung bereitgestellt.

Enthaltene Fremdsoftware: [pdf.js](https://mozilla.github.io/pdf.js/) (Apache-2.0,
Lizenztext in `js/vendor/LICENSE-pdf.js.txt`) sowie die über `npm` installierten
Pakete (alle unter freizügigen Lizenzen wie MIT, ISC oder BSD).
