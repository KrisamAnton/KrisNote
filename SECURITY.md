# Sicherheit

## Sicherheitslücke melden

Bitte melde Sicherheitsprobleme **nicht** öffentlich als Issue, sondern über
den Reiter **Security → "Report a vulnerability"** dieses Repositorys
(vertrauliche Meldung). Beschreibe kurz, was du gefunden hast und wie man es
nachstellen kann. KrisNote ist ein Ein-Personen-Projekt; ich melde mich so
schnell es geht.

## Empfehlungen für den Betrieb

- Registrierung (`ALLOW_REGISTRATION`) nur einschalten, wenn du sie wirklich brauchst.
- Von außerhalb des Heimnetzes nur über **HTTPS** erreichbar machen (Cloudflare Tunnel, Caddy, nginx) oder per VPN.
- Läuft KrisNote hinter einem Proxy/Tunnel: `TRUST_PROXY=1` setzen (siehe README).
- Regelmäßig ein Backup des Ordners `data/` anlegen und KrisNote aktuell halten (`git pull`, siehe README → Update).
- Starke, einzigartige Passwörter verwenden. Passwörter werden nur als Hash gespeichert.
