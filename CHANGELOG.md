# Änderungsprotokoll

Alle nennenswerten Änderungen an KrisNote werden hier festgehalten.
Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/)
(`MAJOR.MINOR.PATCH`).

## [0.1.0] - Testphase

Erste öffentlich freigegebene Version.

### Funktionen

- Notizen mit beliebig tief verschachtelten Unterseiten (wie in OneNote),
  Ordner, Volltextsuche über Titel und Text.
- Freie Zeichenfläche pro Notiz: Text-, Bild- und PDF-Objekte frei
  platzieren, in der Größe ändern, aneinander anheften; Handschrift/Zeichnen
  direkt auf der Fläche.
- Mehrfachauswahl von Objekten auf der Fläche (Umschalt-Klick), gemeinsam
  verschieben/löschen, Kopieren/Einfügen über Standard-Rechtsklick und
  Strg+C/Strg+V - auch zwischen verschiedenen Notizen.
- Audioaufnahmen direkt in der Notiz, optionale Transkription (Text +
  Sprechererkennung) über einen separaten Python-Prozess.
- Mehrbenutzerfähig: jeder Benutzer hat einen eigenen, privaten
  Notizbereich (Notizen, Dateien, Einstellungen komplett getrennt).
- Erinnerungs-Mails (eigene SMTP-Konfiguration pro Benutzer).
- Installierbar als PWA (Offline-App-Shell), helles/dunkles Erscheinungsbild.
- **Ersteinrichtung mit Einrichtungscode:** Beim allerersten Start (noch
  keine Benutzer vorhanden) erzeugt der Server einen zufälligen
  Einrichtungscode im Log; nur damit lässt sich über `/setup.html` der
  erste Benutzer anlegen. Danach ist dieser Weg dauerhaft gesperrt.
- **Selbstregistrierung standardmäßig deaktiviert:** Weitere Benutzer legt
  man über die Kommandozeile an, oder schaltet die offene Registrierung
  bewusst über `ALLOW_REGISTRATION=true` frei.
- Rate-Limits (5 Fehlversuche, 15 Minuten Sperre) für Einrichtungscode,
  Login und Registrierung.
- Versionsnummer per `GET /api/version` abrufbar und in den Einstellungen
  sowie auf der Anmeldeseite sichtbar.

### Bekannt / in Arbeit

- Diese Version ist eine Testphase (0.x) - die Datenstruktur kann sich
  zwischen 0.x-Versionen noch ändern. Vor jedem Update ein Backup von
  `data/` anlegen (siehe README).
