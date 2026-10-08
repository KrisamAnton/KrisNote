<p align="center">
  <img src="icons/sidebar-logo.png" alt="KrisNote logo" width="150">
</p>

<h1 align="center">KrisNote</h1>

<p align="center">
  <b>Your notes. Your server. Your data.</b><br>
  A free, self-hosted note-taking app in the style of OneNote - for PC, tablet and phone.
</p>

<p align="center">
  <a href="README.md">Deutsch</a> · <b>English</b>
</p>

<p align="center">
  <a href="https://github.com/KrisamAnton/KrisNote/releases">Version 1.7.12</a> ·
  <a href="LICENSE">MIT license</a> ·
  <a href="CHANGELOG.md">Changelog (German)</a> ·
  <a href="https://www.paypal.me/KrisamKreativStudio">Support the project</a>
</p>

<p align="center">
  <img src="docs/screenshots/pc-notiz.png" alt="KrisNote on a PC: folders, note list and a note with text and handwriting" width="900">
</p>

> **Note on language:** The app itself currently has a **German user interface** (the screenshots show it). This README is provided in English so you can install and run it. An English interface is not available yet.

## What is KrisNote

KrisNote is a note-taking app that you run **on your own server** (Raspberry Pi,
mini PC, Proxmox container, NAS, VPS - anything with Linux and Node.js). You use
it in the browser or as an installed app on phone, tablet and PC. There is **no
third-party cloud**, no account with a company and no ads.

- Folders, notes and **unlimited nested sub-pages**
- Text, images, PDFs, file attachments and **handwriting/drawings** placed freely on one canvas
- Word-like formatting: headings, bold/italic, lists, colors, highlights
- **Voice notes** - optionally transcribed to text automatically
- **E-mail reminders**, links between notes, search across all notes
- A section for **credentials** (store user names and passwords in an organized way)
- Multiple users, each with their own separate notes
- A dedicated **phone layout** (large buttons, toolbar at the bottom)

## Why not just OneNote?

OneNote is a good program, but it belongs to a large company. KrisNote is for
people who prefer to keep their notes in their own hands:

| | KrisNote | typical cloud note app |
|---|---|---|
| **Where is your data?** | On your own server | With a third-party provider |
| **Account with a company** | not needed | usually required |
| **Cost** | free, MIT license | often a subscription for all features |
| **Does data leave your server?** | No - nothing is sent anywhere | Yes |
| **Backup & export** | One folder (`data/`) - just copy it | Through the provider |
| **Source code visible** | Yes, all of it | No |
| **Sub-pages** | unlimited depth | often limited |

**Privacy in one sentence:** KrisNote has no telemetry, no tracking and no
connection to any service run by the developer - everything you write, draw or
upload stays in one folder on *your* server. (Two optional things that you turn
on yourself are the exception: the e-mail reminder, which is sent through the
mail server you enter yourself, and the voice transcription, which downloads the
speech recognition model once. Your recordings themselves are never sent
anywhere; the conversion runs on your server.)

<p align="center">
  <img src="docs/screenshots/handy-notiz.png" alt="KrisNote on a phone: a note with a shopping list" width="260">
  &nbsp;&nbsp;
  <img src="docs/screenshots/handy-format.png" alt="KrisNote on a phone: formatting menu at the bottom" width="260">
</p>

<p align="center">
  <img src="docs/screenshots/pc-suche.png" alt="KrisNote: search across all notes" width="640">
</p>

## Honestly: what KrisNote is not (yet)

So you are not surprised:

- **You need your own server** (or a small always-on machine) and have to keep it updated and backed up yourself. [Installation](#installation) is one line, but you have to set up backups yourself.
- **No offline mode:** The app needs a connection to your server to load and save notes.
- **No real-time collaboration** - each user has their own notes.
- **No OneNote import** and no native app from an app store - KrisNote is a web app (PWA) that you can add to your phone's home screen.
- **German interface only** for now.
- A **one-person project**: bugs are possible. Make regular backups (see [Backup](#backup)) and report problems as an [issue](https://github.com/KrisamAnton/KrisNote/issues).

## How was KrisNote made?

KrisNote was developed by **Krisam together with an AI** (Claude by Anthropic):
the ideas, wishes, testing on real devices and all decisions come from the human,
and the AI wrote most of the code. We say this openly because you should know
what you are putting on your server - the entire source code is public and open
to read. It has been tested by hand many times; still, as with any software:
back up your data.

## Requirements

- A Linux server, VM or LXC container that runs permanently (for example Debian or Ubuntu). Proxmox is one possible way to virtualize, but not a requirement - any Linux machine with Node.js works.
- **Node.js version 20 or newer.** (The installer sets this up for you on Debian/Ubuntu.)
- **For voice-note transcription (optional):** additionally Python 3 with the packages from `server/requirements.txt` (`faster-whisper`, `pyannote.audio`) and `torch`. Without them KrisNote works normally - only the "convert to text" button for voice recordings has no effect.

## Installation

**Easiest: installer script** (Debian/Ubuntu, as root). It installs Node.js if
needed, clones the repository to `/opt/krisnote`, runs `npm install` and sets up
KrisNote as a systemd service (it keeps running after a server reboot):

```bash
apt-get update && apt-get install -y curl && curl -fsSL https://raw.githubusercontent.com/KrisamAnton/KrisNote/main/install.sh | bash
```

(The first part installs `curl` if it is missing - on fresh Debian containers
that is often the case. If `curl` is already there, it does no harm.)

At the end the script shows the address. You find the setup code for the first
start with `journalctl -u krisnote -n 20`. The installer also asks whether
KrisNote runs behind a tunnel or reverse proxy (for example Cloudflare Tunnel) -
see [Remote access and HTTPS](#remote-access-and-https-optional).

If the one-liner does not work for you, do it in two steps (download first, then run):

```bash
curl -fsSL -o install.sh https://raw.githubusercontent.com/KrisamAnton/KrisNote/main/install.sh
bash install.sh
```

Target folder and service user can be changed beforehand with environment
variables, e.g. `INSTALL_DIR=/srv/krisnote bash install.sh`.

**By hand** (if you want more control):

```bash
git clone https://github.com/KrisamAnton/KrisNote.git KrisNote
cd KrisNote/server
npm install
```

To run it permanently as a service (systemd), copy the template in `deploy/`
(`krisnote.service`), adjust the placeholders (path, user name) and enable it:

```bash
sudo cp deploy/krisnote.service /etc/systemd/system/krisnote.service
sudo nano /etc/systemd/system/krisnote.service   # adjust placeholders
sudo systemctl daemon-reload
sudo systemctl enable --now krisnote
```

**Just to try it out** (runs until you close the terminal window):

```bash
cd KrisNote/server
npm start
```

The server is then reachable at `http://<server-address>:3000` by default.

## First start

Right after installation (no user exists yet) the app is in setup mode:

1. Start the server (see above).
2. Find the line `Einrichtungscode:` (setup code) in the server log:
   - For a systemd service: `journalctl -u krisnote -n 50`
   - Otherwise: in the terminal window where you started the server
3. Open `http://<server-address>:3000/setup.html` in your browser (`/login.html` redirects there automatically as long as no user exists).
4. Enter the setup code, the user name you want, optionally a display name and a password (at least 8 characters). You are signed in right away.
5. Once this first user exists, `/setup.html` is locked permanently.

After 5 wrong setup-code attempts the setup is locked for 15 minutes
(protection against guessing by others on the same network).

## Seeing the version

The installed version is shown discreetly in the app's settings (click your own
user name at the bottom left) and at the bottom of the login page. You can also
query it directly:

```bash
curl http://<server-address>:3000/api/version
```

New versions are listed with their changes in [CHANGELOG.md](CHANGELOG.md)
(German) and marked as a Git tag (e.g. `v1.7.12`) in the repository.

## Settings via environment variables

All variables are optional - without them the defaults apply. Set them at start
(e.g. `PORT=3000 npm start`) or as an `Environment=` line in the systemd service
(see `deploy/krisnote.service`).

| Variable | Default | Explanation |
|---|---|---|
| `PORT` | `3000` | Port the server listens on. |
| `DATA_DIR` | `<install folder>/data` | Folder for user accounts, notes and uploaded files. |
| `ALLOW_REGISTRATION` | off | Set to `true` to let anyone create an account on the login page. Off by default - otherwise you add users on the command line (see below). |
| `SETUP_CODE` | randomly generated | Lets you set the setup code for the very first start instead of having it generated and printed to the log. |
| `TRUST_PROXY` | off | Only needed if KrisNote runs **behind a reverse proxy** (e.g. Cloudflare Tunnel, nginx, Caddy). Value: the number of proxies in front (usually `1`) or the proxy's address (e.g. `10.0.0.5` or `loopback`). See "Remote access and HTTPS". |
| `PYTHON_BIN` | `python3` | Path to the Python interpreter for transcription (e.g. when using your own venv). |
| `WHISPER_MODEL` | `medium` | Model size for speech recognition (`small` is faster but a bit less accurate). |
| `TRANSCRIBE_LANGUAGE` | `de` | Language the transcription expects. |
| `HF_TOKEN` | empty | Hugging Face access token for speaker recognition in transcriptions (optional). Without a token only the plain text is recognized (one speaker). |

**Adding more users on the command line** (always possible, regardless of
`ALLOW_REGISTRATION`):

```bash
node server/create-user.js <username> <password> [display name]
```

## Update

**Easiest:** If you set KrisNote up with the installer script, just run the same
installation line again as root (see "Installation"). The script fetches the
latest version and restarts the service. Your notes and settings stay unchanged.

**By hand:**

1. **Always back up `data/` first** (see "Backup" below). This also applies before a script update.
2. Fetch the new code and update dependencies (with the installer the folder is `/opt/krisnote`):
   ```bash
   cd KrisNote
   git pull
   cd server
   npm install   # only needed if dependencies changed
   ```
3. Restart the service:
   ```bash
   sudo systemctl restart krisnote
   ```

The `data/` folder is not part of the repository (see `.gitignore`) and is never
touched or overwritten by `git pull`.

## Backup

All your data (user accounts, all notes, uploaded images/PDFs/recordings,
reminder mail settings) lives exclusively in the `data/` folder (path can be
changed with `DATA_DIR`, see above). Back this folder up regularly, e.g.:

```bash
tar -czf krisnote-backup-$(date +%F).tar.gz -C KrisNote data
```

For a guaranteed consistent backup, stop the service briefly (`sudo systemctl
stop krisnote`, then `sudo systemctl start krisnote` after the backup). Backing
up while running also works in practice, since writes are atomic.

## Remote access and HTTPS (optional)

Right after installation KrisNote is only reachable inside your home network at
`http://<server-address>:3000`. That is enough for many people. If you also want
access from outside (and the "add to home screen" app feel on your phone, which
only works over **HTTPS**), you have these options:

| Option | Effort | Notes |
|---|---|---|
| **Home network only** | none | the safest option |
| **VPN** (e.g. Tailscale or WireGuard) | low | no router port open; the phone must be on the VPN |
| **Cloudflare Tunnel** | medium | needs your own domain, HTTPS is automatic, no router port open |
| **Reverse proxy** (Caddy, nginx) | medium | HTTPS via Let's Encrypt, port 443 must be forwarded |

**Example Cloudflare Tunnel:** In Cloudflare under *Zero Trust → Networks →
Connectors*, create a tunnel, add a *published application route* with your
domain and enter `http://<server-address>:3000` as the service URL (the URL must
start with `http://`).

**Important as soon as KrisNote is reachable from the internet:**

1. **Keep `ALLOW_REGISTRATION` off** (default) - otherwise anyone can create an account.
2. **Only reachable over HTTPS**, so passwords are not sent unencrypted.
3. Use a **strong password**.
4. **Set `TRUST_PROXY=1`** if a proxy/tunnel sits in front (see below).

**What is `TRUST_PROXY`?** If KrisNote runs behind a proxy or tunnel, the server
only sees the proxy's address for every request. Without `TRUST_PROXY=1` the
lock after failed attempts then affects all visitors together (someone from
outside could briefly lock your account with deliberate wrong attempts), and the
login cookies are not marked "Secure". The **installer asks** about it and sets
it automatically. By hand:

```bash
sudo systemctl edit krisnote
# in the editor that opens, enter:
#   [Service]
#   Environment=TRUST_PROXY=1
sudo systemctl restart krisnote
```

If KrisNote runs **without** a proxy (direct access), **do not** set it - otherwise
the address could be forged with a header sent along.

More on security: [SECURITY.md](SECURITY.md).

## Support the project

KrisNote is and stays free. If you like it and want to reward the work behind
it, I appreciate a voluntary donation:
[paypal.me/KrisamKreativStudio](https://www.paypal.me/KrisamKreativStudio).
The link is also in the app under settings.

## License

KrisNote is released under the **MIT license** (see [LICENSE](LICENSE)): you may
use, modify and share it for free - also commercially. The copyright notice and
license text must be kept. The program is provided without any warranty.

Included third-party software: [pdf.js](https://mozilla.github.io/pdf.js/)
(Apache-2.0, license text in `js/vendor/LICENSE-pdf.js.txt`) and the packages
installed via `npm` (all under permissive licenses such as MIT, ISC or BSD).
