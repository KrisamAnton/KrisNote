// Fest eingebaute "Erklärung KrisNote": eine kleine Einführungs-Notiz samt
// Unterseiten, die jeder neue Benutzer (Ersteinrichtung UND spätere
// Registrierung) automatisch als eigene, unabhängige Kopie bekommt - anders
// als früher wird dafür NICHT mehr bei einem bereits bestehenden Benutzer
// nach einer gleichnamigen Notiz gesucht (das schlug auf einer frischen
// Installation ohne jeden anderen Benutzer fehl). Der Inhalt hier ist die
// Original-Erklärung, die Anton Krisam für neue Benutzer geschrieben hat.
const crypto = require('crypto');

function htmlToPlainText(html) {
  return html
    .replace(/<(div|p|br|li)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

// Baut aus einer Liste von Zeilen (bereits fertiges Inline-HTML je Zeile)
// die Zeilenstruktur, die ein contenteditable-Textfeld auch selbst erzeugen
// würde: eine eigene Zeile pro <div>, eine leere Zeile als Abstandshalter.
function lines(...items) {
  return items.map((item) => (item === '' ? '<div><br></div>' : `<div>${item}</div>`)).join('');
}

function heading2(text) {
  return `<div class="heading-2">${text}</div>`;
}

function buildErklaerungKrisNoteSeed(logoFilename) {
  const folderId = crypto.randomUUID();
  const now = Date.now();

  const ids = {
    root: crypto.randomUUID(),
    zugangsdaten: crypto.randomUUID(),
    email: crypto.randomUUID(),
    verschieben: crypto.randomUUID(),
    hintergrund: crypto.randomUUID(),
    verlinkung: crypto.randomUUID(),
    erinnerungen: crypto.randomUUID(),
    pdfs: crypto.randomUUID(),
    sprachnotiz: crypto.randomUUID(),
    bilder: crypto.randomUUID(),
    zeichnen: crypto.randomUUID(),
    text: crypto.randomUUID(),
  };

  const link = (key, label) => `<a class="note-internal-link" data-note-id="${ids[key]}">${label}</a>`;

  function textObject(html, h) {
    return {
      id: crypto.randomUUID(), type: 'text', x: 24, y: 24, w: 700, h, z: 0,
      text: htmlToPlainText(html), html, parentId: null, style: 'free',
    };
  }

  function note(id, title, parentNoteId, order, html, h) {
    return {
      id, title,
      objects: [textObject(html, h)],
      ink: { strokes: [] },
      background: 'dots',
      folderId,
      parentNoteId,
      order,
      createdAt: now,
      updatedAt: now,
    };
  }

  const rootHtml = lines(
    `<img class="inline-text-image" src="/files/${logoFilename}" style="width:140px">`,
    '',
    heading2('Willkommen bei KrisNote! 👋'),
    '',
    'KrisNote ist deine eigene, private Notizen-App – so wie diese hier, in der du gerade liest. Alles läuft auf deinem eigenen Server, nichts landet bei einer fremden Firma in der Cloud. Du kannst Notizen mit Ordnern organisieren, Bilder, PDFs, Sprachnotizen und Zugangsdaten direkt reinpacken, Erinnerungen setzen – und sogar Notizen untereinander verlinken, wie kleine Wikipedia-Seiten nur für dich.',
    '',
    'Am schnellsten lernst du KrisNote kennen, indem du einfach loslegst: Tippe irgendwo auf die leere Fläche, und schon kannst du schreiben. Über die Werkzeugleiste oben fügst du alles andere hinzu.',
    '',
    '<b>📎 Die Werkzeugleiste im Überblick</b>',
    '',
    link('text', '📝 Text hinzufügen – ein neues Textfeld auf der Fläche'),
    link('zeichnen', '✏️ Zeichnen – mit Finger oder Maus frei skizzieren'),
    link('pdfs', '📎 PDF hinzufügen – direkt in den Text oder als eigene Datei speichern'),
    link('sprachnotiz', '🎙️ Sprachnotiz – eine Aufnahme direkt in der Notiz speichern'),
    link('bilder', '🖼️ Bilder oder Datei anhängen – z. B. Word- oder Excel-Dateien'),
    link('zugangsdaten', '🔒 Zugangsdaten – Benutzername/Passwort übersichtlich speichern'),
    link('erinnerungen', '⏰ Erinnerung per Mail zu einem bestimmten Datum innerhalb eines Textfeldes'),
    link('email', '✉️ E-Mail Versand einrichten (Notwendig für die oben genannte Erinnerungsfunktion)'),
    link('verlinkung', '🔗 Verknüpfung – Text mit einer anderen Notiz verlinken'),
    link('hintergrund', '📄 Hintergrund – Muster der Fläche ändern'),
    link('verschieben', '📁 Verschieben – Notiz in einen anderen Ordner verschieben'),
    '',
    '<b>📚 Mehr im Detail</b>',
    '',
    link('text', 'Text schreiben & formatieren'),
    link('bilder', 'Bilder, PDFs, Sprachnotizen & Dateien einfügen'),
    link('zugangsdaten', 'Zugangsdaten & Erinnerungen'),
    link('verlinkung', '🔗 Verlinkung zwischen Notizen (das Herzstück von KrisNote)'),
    link('hintergrund', 'Organisation: Hintergrund, Verschieben & Ordner'),
    '',
    'Am besten probierst du gleich selbst ein paar Sachen aus – kaputt machen kannst du dabei nichts 😊',
  );

  const zugangsdatenHtml = lines(
    heading2('🔓 Zugangsdaten'),
    '',
    '<b>Wofür:</b> Eine Karte, auf der du Login-Daten oder andere kurze, wichtige Informationen strukturiert (als Bezeichnung + Wert) griffbereit hast - statt sie in einem normalen Textabsatz zu suchen oder zu vergessen. Typische Beispiele:',
    '- Login für Router, NAS, Proxmox, Kamera-System, Drucker',
    '- WLAN-Name und -Passwort für Gäste oder Geräte',
    '- Zugang zu einem Streaming- oder Online-Dienst',
    '- Lizenzschlüssel/Seriennummer eines Programms oder Geräts',
    '- PIN-Codes (Alarmanlage, Tür-Zahlenschloss, SIM-Karte)',
    '- Antworten auf Sicherheitsfragen, interne Firmen-Logins, etc.',
    '',
    'Du bist dabei nicht auf "Benutzername" und "Passwort" festgelegt - du kannst beliebig viele Zeilen mit eigener Bezeichnung anlegen (z. B. "IP-Adresse", "Port", "Notiz").',
    '',
    '<b>Anlegen:</b> 🔓-Knopf drücken → Titel der Karte eingeben (z. B. "Router Wohnzimmer") → die zwei vorausgefüllten Felder "Benutzername"/"Passwort" ausfüllen oder umbenennen, mit "+ Feld hinzufügen" weitere Zeilen ergänzen → Speichern.',
    '',
    '<b>Anzeigen:</b> Auf der Fläche erscheint die Karte zunächst nur eingeklappt (Titel + Schlüssel-Symbol) - die eigentlichen Werte sind nicht sichtbar. Erst ein Klick auf die Karte klappt sie auf und zeigt alle Felder; ein erneuter Klick klappt sie wieder zu. Das schützt zwar vor einem flüchtigen Blick übers Textfeld, ist aber kein echter Passwort-Tresor: Wer die Notiz öffnen kann, kann die Karte auch aufklappen und die Werte lesen - die Werte werden nicht verschlüsselt gespeichert.',
    '',
    '<b>Kopieren:</b> Ist die Karte aufgeklappt, lässt sich jeder Wert ganz normal markieren (z. B. doppelt antippen) und kopieren, wie jeder andere Text auch.',
    '',
    '<b>Bearbeiten/Löschen:</b> Beim Antippen der Karte erscheint oben eine kleine Werkzeugleiste mit "Bearbeiten" (öffnet wieder das Eingabefenster, Titel/Felder änderbar) und "Löschen".',
  );

  const emailHtml = lines(
    '⏰ Damit Erinnerungen wirklich als E-Mail bei dir ankommen, muss KrisNote wissen, über welches E-Mail-Konto es versenden soll.',
    '',
    '<b>Wo einstellen:</b> Auf dein Profil-Symbol (unten links in der Seitenleiste) tippen → "Erinnerungs-Mail".',
    '',
    '<b>Was du einträgst:</b>',
    '',
    heading2('Erinnerungs-E-Mail-Adresse'),
    'Die Adresse, an die fällige Erinnerungen geschickt werden (deine "Postfach"-Adresse, wo du sie lesen willst).',
    '',
    heading2('Versand-Konto (SMTP)'),
    '- das E-Mail-Konto, über das KrisNote im Hintergrund verschickt:',
    '- SMTP-Server: bei GMX "mail.gmx.net"',
    '- Port: 587',
    '- Verschlüsselung: STARTTLS',
    '- Benutzername: deine volle GMX-Adresse (z. B. name@gmx.at)',
    '- Passwort: dein normales GMX-Postfach-Passwort (siehe Hinweis unten)',
    '- Absendername (optional): z. B. "KrisNote Erinnerungen"',
    '',
    '<b>Wichtig bei GMX - einmalig im GMX-Postfach freischalten:</b>',
    'In deinem GMX-Postfach unter Einstellungen → POP3/IMAP den Zugriff aktivieren. Ohne das lehnt GMX den Login von KrisNote ab, selbst mit richtigem Passwort.',
    '',
    '<b>Warum GMX funktioniert und live.de (Outlook/Hotmail) nicht:</b>',
    'Microsoft hat den einfachen Login per Benutzername + Passwort (die sogenannte "Basic Authentication") für den E-Mail-Versand bei privaten live.de-/Outlook.com-/Hotmail-Konten aus Sicherheitsgründen komplett abgeschaltet - das betrifft alle Programme, die so wie KrisNote auf diese Art senden, nicht nur KrisNote selbst. Es lässt sich auch mit einem App-Passwort nicht umgehen, weil Microsoft für solche Konten mittlerweile ausschließlich ein modernes, deutlich komplizierteres Anmeldeverfahren akzeptiert, das KrisNote nicht eingebaut hat. Eine E-Mail-Adresse eines Anbieters, der den klassischen Login noch erlaubt (wie GMX, aber z. B. auch web.de oder ein Konto beim eigenen Internet-Provider), ist deshalb die einfachere Wahl für dieses Versand-Konto - unabhängig davon, wo deine eigentliche Erinnerungs-Adresse liegt.',
    '',
    '<b>Tipp:</b> Ist das Versand-Konto zusätzlich mit einer Zwei-Faktor-Anmeldung (2FA) abgesichert, brauchst du statt des normalen Passworts ein separates "App-Passwort", das du in den Sicherheitseinstellungen dieses Kontos anlegst.',
  );

  const verschiebenHtml = lines(
    '📁 Verschieben verschiebt die Notiz in einen anderen Ordner. Hat sie Unterseiten, wandern die automatisch mit.',
    '',
    'Wenn man eine Überschrift (links) verschieben möchte,',
    '',
    'muss man sie ca. 3 Sekunden lang gedrückt halten, danach kann man sie mit gedrückter Maustaste dorthin verschieben, wo man sie haben möchte (kann auch zu einer anderen Überschrift, bzw. anderen Stufen der Überschrift gemacht werden)',
  );

  const hintergrundHtml = lines(
    '📄 Hintergrund ändert das Muster der Fläche (Punkte, Linien, einfarbig) – rein optisch, nach Geschmack.',
  );

  const verlinkungHtml = lines(
    'Das ist eine der praktischsten Funktionen von KrisNote: Du kannst innerhalb eines Textes auf eine ANDERE Notiz verlinken – so wie bei Wikipedia.',
    '',
    '<b>So setzt du einen Link:</b>',
    '1. Markiere den Text, der zum Link werden soll (z. B. einen Gerätenamen).',
    '2. Tippe auf 🔗.',
    '3. Es öffnet sich ein Auswahlfenster: erst deine Ordner, dann die Notizen darin, dann eventuelle Unterseiten – klick dich durch, bis du die richtige Notiz gefunden hast.',
    '4. Tippe auf „Link setzen".',
    '',
    'Der markierte Text erscheint jetzt violett statt blau – so unterscheidet er sich von normalen Internet-Links. Tippst du darauf, springst du zur verlinkten Notiz. Oben erscheint dann ein roter „Zurück"-Knopf, mit dem du sofort wieder zur Ausgangsnotiz kommst – auch über mehrere Links hinweg.',
    '',
    'Beispiel: Du schreibst „...läuft auf dem neuen Server" und verlinkst „neuen Server" direkt mit deiner Server-Notiz. Ein Klick, und du bist dort. Die Überschrifts-Namen können danach auch geändert werden, der Link bleibt.',
  );

  const erinnerungenHtml = lines(
    heading2('⏰ Erinnerung innerhalb eines Textfeldes vergeben'),
    '<i>Es können beliebig viele unterschiedliche Erinnerungen in einem oder mehreren Textfeldern vergeben werden</i>',
    '',
    '<b>Anwendung:</b>',
    'Z.B. wenn man eine Seite mit Versicherungen erstellt hat, und hier eine Auslauffrist hat, kann man sich in eine Zeile stellen, und auf das Weckersymbol ⏰ klicken (Als Text wird in der Erinnerung automatisch der Text der aktivierten Zeile genommen (kann überschrieben werden))',
    '',
    'Überschrift ist der Betreff der Mail, welche man zu dem Zeitpunkt erhält, welchen man unter Erinnerungsdatum und -uhrzeit eingibt.',
    '',
    'Wichtig dafür ist, das man seinen Mailserver und seine Mail vergeben hat, wo man sie hinhaben möchte (Am besten funktioniert das aktuell mit einem gmx Account, weil hier keine doppelten Sicherheitsabfragen verlangt werden).',
  );

  const pdfsHtml = lines(
    heading2('📄 PDF hinzufügen'),
    '',
    'Es gibt drei Möglichkeiten, eine PDF in KrisNote zu bekommen:',
    '',
    '<b>1. Als Ausdruck auf die Fläche einfügen ("Alle Seiten anzeigen")</b>',
    `Die ganze PDF wird optisch auf die Fläche gedruckt (alle Seiten untereinander) - du kannst danach direkt ${link('zeichnen', 'draufzeichnen')} oder Text platzieren, und sie in der Größe verändern.`,
    '',
    '<b>2. Als Datei-Symbol ablegen ("Nur Datei ablegen")</b>',
    'Kompakte Ablage als Datei-Symbol, ohne die Seiten anzuzeigen - von dort aus lässt sie sich jederzeit öffnen.',
    'Der Name lässt sich im Nachhinein ändern: oben in der Werkzeugleiste der PDF auf "Umbenennen" klicken.',
    '',
    '<b>3. Direkt im Text einbetten</b>',
    'Praktisch, wenn du z. B. etwas beschreibst und die passende PDF direkt an dieser Textstelle haben willst - sie bleibt dort eingebettet, auch wenn sich der Text drumherum ändert oder verschiebt.',
    '',
    '<b>Zwei Wege dorthin:</b>',
    '- Über den Datei-Knopf in der Werkzeugleiste: Cursor vorher an die gewünschte Stelle im Text setzen, dann PDF auswählen - im Auswahlfenster erscheint eine dritte Option "Im Text ablegen".',
    '- Nachträglich, wenn die PDF schon als freistehende Karte auf der Fläche liegt: Cursor an die gewünschte Stelle im Text setzen, dann zur PDF-Karte wechseln und dort in der Werkzeugleiste den Knopf "An der Cursor-Stelle im Text platzieren" (das Cursor-Symbol, links neben dem Löschen-Knopf) drücken.',
    '',
    'Wichtig: Eine PDF kann auch von außen (z. B. aus dem Explorer/Finder) direkt auf die Fläche gezogen werden - dafür MUSS aber das gewünschte Textfeld bereits geöffnet sein (Cursor blinkt sichtbar an der Stelle, wo die PDF hin soll), bevor du die Datei ziehst.',
    '',
    'Ohne aktiven Cursor bekommst du nur die ersten beiden Optionen angeboten, nicht "Im Text ablegen".',
    '',
    '<b>🎯 Die Knöpfe an einer PDF</b>',
    '',
    '<b>Freistehende PDF-Karte auf der Fläche</b> (oben in der Titelleiste):',
    '- Öffnen - zeigt die Original-PDF in einem neuen Tab',
    '- Umbenennen - nur bei "Nur Datei ablegen"-Karten, ändert den angezeigten Namen',
    '- An der Cursor-Stelle im Text platzieren - verschiebt die PDF nachträglich in den Text (siehe oben)',
    '- Löschen - entfernt die PDF-Karte',
    '',
    '<b>Im Text eingebettetes PDF-Symbol</b> (Werkzeugleiste erscheint beim Drüberfahren mit der Maus):',
    '- Öffnen - zeigt die Original-PDF in einem neuen Tab',
    '- Umbenennen - ändert den angezeigten Namen',
    '- Löschen - fragt vorher nach, ob wirklich gelöscht werden soll (damit man es nicht aus Versehen beim Text-Löschen mitreißt)',
  );

  const sprachnotizHtml = lines(
    '🎙️ Sprachnotiz nimmt eine Aufnahme direkt in der Notiz auf – ideal, wenn dir unterwegs etwas einfällt und Tippen zu lange dauert.',
    'Wenn man den Button drückt, beginnt sogleich die Aufzeichnung, das Mikrofon blinkt rot. Ein erneutes Drücken beendet die Aufnahme, und erstellt eine Sprachnotizdatei auf der Seite.',
    '',
    heading2('Sprachnotiz in Text umwandeln lassen'),
    'Mit Druck auf den Button links neben dem Löschen-Symbol wird der gesprochene Text in Schrift umgewandelt.',
    '',
    '(ggf. muss das Fenster nach unten erweitert werden, um den Text zu sehen)',
    '',
    'Dies kann bei längeren Aufzeichnungen auch über eine Stunde dauern!',
  );

  const bilderHtml = lines(
    '🖼️ Bild hinzufügen fügt ein Foto ein – entweder frei auf der Fläche oder, wenn du gerade in einem Text schreibst, direkt mitten im Textfluss. Die Größe kannst du danach jederzeit anpassen.',
    '',
    'Man kann ein Bild auch direkt auf das Blatt ziehen (oder ein kopiertes Bild einfügen lassen).',
    '',
    '📎 Datei anhängen ist für alles andere gedacht, z. B. Word- oder Excel-Dateien, die du griffbereit haben willst.',
  );

  const zeichnenHtml = lines(
    '✏️ Zeichnen schaltet in den Stift-Modus um. <i>Oben erscheint dann eine kleine Werkzeugleiste.</i>',
    '',
    '- Stift – frei zeichnen',
    '- Auswählen (Lasso) – einen Teil der Zeichnung einkreisen, um ihn zu verschieben, zu löschen oder anzuheften (siehe unten)',
    '- Radiergummi – einzelne Striche wegradieren',
    '- Rückgängig – den letzten Strich zurücknehmen',
    '- Alles löschen – die ganze Zeichnung entfernen',
    '',
    '<b>🔗 Zeichnung mit einem Bild oder PDF verknüpfen</b>',
    'Liegt ein Teil deiner Zeichnung auf einem Bild oder PDF (z. B. ein eingekreister Bereich auf einem Foto), kannst du sie fest damit verbinden: Mit dem Lasso den gewünschten Teil markieren – über der Auswahl erscheint ein kleiner Anheften-Knopf. Danach bewegt und skaliert sich die Zeichnung automatisch mit, sobald du das Bild/PDF verschiebst oder in der Größe änderst. Über denselben Knopf (dann „Lösen") hebst du die Verbindung wieder auf.',
    '',
    'Wichtig: Das funktioniert nur mit Bildern und PDFs als Anker – nicht direkt mit einem Textfeld.',
  );

  const textHtml = lines(
    '📝 Mit Text hinzufügen erstellst du ein neues Textfeld.',
    'Einfacher geht\'s noch: Tippe einfach auf eine leere Stelle der Fläche – dann entsteht automatisch ein Textfeld genau dort.',
    '',
    'Sobald du in einem Textfeld schreibst, erscheinen oben zusätzliche Formatierungs-Knöpfe:',
    '- Formatvorlage (Überschrift) – für Titel und Zwischenüberschriften',
    '- Schriftart & Schriftgröße',
    '- Fett / Kursiv / Unterstrichen / Durchgestrichen',
    '- Hoch- und Tiefgestellt',
    '- Textfarbe & Markieren (wie ein Textmarker)',
    '- Aufzählungszeichen & Nummerierung',
  );

  const folder = { id: folderId, name: 'Erklärung KrisNote', color: '#30d158' };

  const notes = [
    note(ids.root, 'Erklärung KrisNote', null, 0, rootHtml, 900),
    note(ids.zugangsdaten, 'Zugangsdaten & Erinnerungen', ids.root, 0, zugangsdatenHtml, 800),
    note(ids.email, 'E-Mail-Versand für Erinnerungen einrichten', ids.root, 1, emailHtml, 900),
    note(ids.verschieben, 'Verschieben', ids.root, 2, verschiebenHtml, 260),
    note(ids.hintergrund, 'Hintergrund', ids.root, 3, hintergrundHtml, 120),
    note(ids.verlinkung, 'Verlinkung zwischen Notizen', ids.root, 4, verlinkungHtml, 500),
    note(ids.erinnerungen, 'Erinnerungen', ids.root, 5, erinnerungenHtml, 400),
    note(ids.pdfs, 'PDFs einfügen', ids.root, 6, pdfsHtml, 1200),
    note(ids.sprachnotiz, 'Sprachnotiz', ids.root, 7, sprachnotizHtml, 400),
    note(ids.bilder, 'Bilder & Dateien einfügen', ids.root, 8, bilderHtml, 260),
    note(ids.zeichnen, 'Zeichnen', ids.root, 9, zeichnenHtml, 500),
    note(ids.text, 'Text schreiben & formatieren', ids.root, 10, textHtml, 400),
  ];

  return { folder, notes };
}

module.exports = { buildErklaerungKrisNoteSeed };
