# Claude Code Prompt: Korfu & Ksamil Familienreise-Website

Kopiere den folgenden Prompt komplett in Claude Code:

---

Baue mir eine interaktive Reise-Website als **eine einzige, portable `index.html`** (alle CSS/JS/Assets inline bzw. via CDN), optimiert für Desktop UND Mobile (iOS Safari!). Die Seite wird später via Cloudflare Pages (Wrangler CLI) deployed, daher: keine Build-Tools, kein Framework-Setup, nur eine einzelne HTML-Datei.

## WICHTIG: Skill-Auswahl
Prüfe zuerst die verfügbaren Skills in diesem Projekt (`frontend-design`, `ui-ux-pro-max`, `huashu-design`, `emil-kowalski-motion`) und wähle automatisch die Kombination aus, die für eine hochwertige, animierte Reise-Website am besten passt. Lies die gewählten SKILL.md-Dateien VOR dem ersten Code, nicht danach. Begründe kurz deine Wahl. Für Animationen/Micro-Interactions ist `emil-kowalski-motion` vermutlich Pflicht, für die visuelle Gesamtqualität `frontend-design` oder `huashu-design` — entscheide selbst anhand der Skill-Beschreibungen.

## Design-Richtung: Mediterran / Ionisches Meer
Die Optik soll sich dem Reiseziel anpassen und trotzdem richtig Spaß machen — und für eine Familie mit zwei Teenagern (13 & 15 Jahre) funktionieren, nicht nur für kleine Kinder:
- **Farbwelt**: Ägäisblau/Türkis (Meer), Olivgrün, warmes Terrakotta/Sandocker, Kalkweiß + ein kräftiger Zitronen-/Sonnengelb-Akzent
- **Stimmung**: sommerlich-leicht, verspielt, familienfreundlich — KEINE sterile Corporate-Optik. Denkbar: handgezeichnete Wellen-/Olivenzweig-Silhouetten, subtile Sonnen- oder Wasser-Glitzer-Animationen, kleine Boots-/Muschel-Icons
- **Typografie**: charaktervolle Display-Font für Headlines (mediterran/verspielt, z.B. via Google Fonts), gut lesbare Sans für Fließtext
- **Motion**: liebevolle Micro-Animations (Hover, Tab-Wechsel, Karten-Einblendungen) — hier den Motion-Skill voll ausspielen

## Intro-Splash (max. 10 Sekunden)
Kurzes animiertes Intro **MIT den Porträts der vier Reisenden, umgesetzt als kleine animierte Comic-/Cartoon-Figuren** (aus den Fotos abgeleitete, vereinfachte/stilisierte Avatare — keine realistischen Fotos direkt verwenden, sondern eine verspielte Illustrations-Version je Person). Szene z.B.: die vier Comic-Figuren erscheinen nacheinander vor einer animierten Mittelmeer-Kulisse (Boot, Strand, Sonne, blaues Wasser), ihre Namen werden eingeblendet (Michael, Nina, Leah, Maxi), dann automatischer Übergang zur Hauptseite. Skip-Button nicht vergessen. Gesamtdauer hart auf ~10 Sekunden begrenzen.

**Hinweis zu den Porträtfotos:** Die Originalfotos der Familie liegen als separate Dateien vor und müssen vor dem Bau der Seite bereitgestellt werden (lokal referenzieren, nicht von extern laden). Falls Claude Code an dieser Stelle keinen Zugriff auf echte Fotos hat, bitte mit Platzhalter-Avataren (z. B. einfache SVG-Comic-Köpfe mit Initialen) arbeiten und das im Output klar kennzeichnen.

## Reisedaten

**Reisende:** Michael, Nina (Eltern), Leah & Maxi (Teenager, 15 und 13 Jahre alt) — die Aktivitäten- und Restaurantauswahl soll explizit auf Teenager zugeschnitten sein, nicht auf Kleinkinder: Selfie-/Foto-Spots, etwas Nightlife/Abendprogramm und altersgerechter Spaßfaktor sind genauso wichtig wie Kultur und Strand.

**Reisezeitraum:** 18.07.2026 – 03.08.2026 (ca. 2,5 Wochen), Ziel: Korfu (Griechenland) & Ksamil (Albanien)

**Reiseroute / Etappen:**
1. **Korfu – Agios Gordios** (Unterkunft: Poseidon Suites by CorfuEscapes) — erste Etappe nach der Anreise
2. **Ksamil, Albanien** (Unterkunft: Muze Hotel) — Zwischenetappe, Anreise per Fähre (z. B. Korfu Stadt – Saranda; recherchiere aktuelle Fährverbindungen, Fahrplan, Dauer und Buchungsmöglichkeit)
3. **Korfu – Ýpsos** (Unterkunft: Hotel Yannis Corfu) — letzte Etappe vor dem Rückflug

Recherchiere für den Übergang Korfu → Ksamil → Korfu sinnvolle Reisezeiten/Fährzeiten und plane die Tage realistisch um diese Transfers herum.

**Anreise (Tag 1, Sa 18.07.):**
- Abfahrt mit dem Auto von Plankenwarth 228, 8113 St. Oswald (alle vier Reisenden gemeinsam)
- Weiterfahrt zum **Hauptbahnhof Graz**
- Zugfahrt **OS3588**, 14:00 Uhr ab Graz, Fahrzeit ca. 2:57 Std. → Ankunft Wien ca. 16:57 Uhr (AUA-Codeshare-Zugverbindung Graz–Wien)
- Weiterflug **OS863**, 19:30 Uhr, Wien (VIE) → Korfu (CFU), Flugzeit ca. 1:45 Std. → Ankunft ca. 21:15 Uhr Ortszeit
- Transfer vom Flughafen Korfu zur ersten Unterkunft: **Poseidon Suites by CorfuEscapes, Agios Gordios** (Ankunft abends — Tag 1 ist praktisch nur Anreisetag, keine Aktivitäten mehr einplanen)

**Rückreise (letzter Tag, Mo 03.08.):**
- Rückflug **OS862**, 10:50 Uhr, Korfu (CFU) → Wien (VIE), Flugzeit ca. 1:45 Std. → Ankunft ca. 12:35 Uhr
- Weiterflug **OS117**, 15:00 Uhr, Wien (VIE) → Graz, Flugzeit ca. 0:35 Std. → Ankunft ca. 15:35 Uhr
- Abholung am Flughafen Graz mit dem Auto, Heimfahrt nach Plankenwarth 228, 8113 St. Oswald (alle vier gemeinsam)
- Letzter Vormittag vor Ort (bis Abflug 10:50) ist noch fast vollständig nutzbar — Checkout/Transfer zum Flughafen Korfu rechtzeitig einplanen

**Geplante Aktivitäten (auf die Etappen und Tage sinnvoll verteilen, ausgerichtet auf zwei Teenager 13/15 — Mischung aus Kultur, Action, Wasserspaß und „Content-würdigen" Spots):**

*Korfu allgemein:*
- Korfu-Stadt (Altstadt, Festungen Old/New Fortress, UNESCO-Weltkulturerbe) — Altstadt-Gassen sind auch fotogen
- Strände rund um Agios Gordios & Ýpsos (Schwimmen, Wassersport: Jetski, Bananaboat, SUP, Parasailing — alles, was für Teens Spaß macht)
- Achilleion-Palast
- Paleokastritsa (Bucht, Bootstouren, Höhlen) — bekannter Instagram-/TikTok-Spot wegen der türkisen Bucht und der Klippen
- Pontikonisi (Mauseinsel) & Kanoni — klassischer Foto-Spot mit der kleinen Insel im Wasser
- Bootsausflug/Schnorcheln, ggf. Cliff-Jumping-Spots (sofern sicher und altersgerecht) in der Umgebung von Paleokastritsa/Agios Gordios recherchieren
- Wasserpark (Aqualand Corfu o. ä., falls saisonal geöffnet) — klassischer Teenager-Spaß-Tag
- Quad-/Buggy-Touren oder geführte Mountainbike-Touren für Teens (falls altersgerecht angeboten, recherchieren)

*Ksamil/Albanien:*
- Ksamil-Strände & vorgelagerte Inseln (mit Boot erreichbar) — die Inseln sind ein bekannter Foto-/Drohnen-Spot (türkises Wasser, kleine Inseln) und bei jungen Reisenden auf Social Media sehr präsent
- Butrint (antike Ausgrabungsstätte, UNESCO-Weltkulturerbe, gut für einen kürzeren Tagesausflug, nicht zu lang für Teens planen)
- Blaues Auge (Syri i Kaltër) — sehr bekannter, fotogener Naturspot (glasklares blaues Quellwasser), beliebter Stopp für Reisende auf der Suche nach guten Fotomotiven

*Selfie-/Social-Media-Spots (eigene Kategorie/Markierung auf der Karte):*
Markiere die bekanntesten "Instagram-/TikTok-Spots" der Reise explizit (z. B. Paleokastritsa-Klippen, Ksamil-Inseln/Strandbar mit Blick aufs Wasser, Blaues Auge, Pontikonisi/Kanoni, evtl. bekannte Strandschaukeln oder Aussichtspunkte in Ksamil) — recherchiere aktuell beliebte, leicht zugängliche Fotopunkte und liste sie mit kurzem Tipp (beste Tageszeit für Licht, wie überfüllt es meist ist).

*Nightlife/Abendprogramm für Teens (kein Erwachsenen-Nightlife, sondern altersgerecht):*
Recherchiere familien-/teenagertaugliches Abendprogramm: Strandpromenaden mit Lichterketten/Musik, Beach-Bars mit Live-Musik (ohne Clubcharakter), Eisdielen/Dessert-Spots mit Abendöffnungszeiten, ggf. ein Open-Air-Kino, Nachtmärkte oder Stand-Up-Paddle-/Kajak-Touren bei Sonnenuntergang, Strandspaziergang mit Blick auf den Sonnenuntergang als wiederkehrendes Abend-Highlight. In Korfu-Stadt ggf. die belebte Liston-Promenade abends erwähnen.

Recherchiere aktuelle Öffnungszeiten, Fährzeiten (Korfu–Saranda) und Ausflugsmöglichkeiten und plane realistisch unter Berücksichtigung der Transfertage. Hinweis: Ende Juli/Anfang August ist Hochsommer mit sehr hohen Temperaturen — Hitze-/Sonnenschutz-Hinweise (besonders für die Kinder) und ausreichend Pausen/Schwimmzeiten gerne thematisieren.

## Restaurant- & Café-Empfehlungen
Recherchiere **mittelpreisige** Restaurants und Cafés in Agios Gordios, Ýpsos, Korfu-Stadt und Ksamil (gehobene Preisklasse vermeiden). Da die Kinder Teenager (13/15) sind, NICHT auf Kindermenüs/Spielecken fokussieren, sondern auf Orte, die auch bei Jugendlichen gut ankommen: gute Burger/Pizza-Optionen, Strand-Cafés mit Aussicht und WLAN, Orte mit lockerer/„instagrammable" Atmosphäre (schöne Deko, Sonnenuntergangsblick), Eisdielen/Dessert-Spots. Baue sie als eigene Sektion oder als Marker-Kategorie in die Karte ein. Pro Empfehlung: Name, kurze Beschreibung, ungefähres Preisniveau, Lage/Nähe zu den Aktivitäten, ggf. Hinweis ob besonders fotogen/beliebt bei jungen Gästen. Mische: 2–3 Frühstücks-/Café-Optionen, 3–4 Mittag/Abend (gern griechische/albanische Küche: Souvlaki, Moussaka, frischer Fisch, Byrek — aber auch unkompliziertere Optionen wie gute Pizzerien einbeziehen), 1–2 Eisdielen/Dessert-Stopps für den Abend.

## Features (1:1 vom bewährten Konzept übernehmen)

1. **Tagesübersicht mit Tabs**: Ein Tab pro Tag der gesamten Reise + „ALLE". Da die Reise ca. 2,5 Wochen dauert, Tabs sinnvoll nach den drei Etappen gruppieren (z. B. Etappen-Überschrift + Tag-Unterteilung), damit die Tab-Leiste nicht unübersichtlich wird. Mobile: horizontal scrollbare Tab-Leiste mit kurzen Labels, `touch-action: pan-x` und `-webkit-overflow-scrolling: touch` (KEINE Swipe-Gesten — die sind auf iOS unzuverlässig).

2. **Interaktive Leaflet-Karte**: Leaflet.js via CDN, farbcodierte Routen pro Etappe/Tag (jede Etappe eine eigene Farbe aus der mediterranen Palette), nummerierte Marker pro Stopp, Restaurant-Marker als eigene Kategorie, **zusätzlich eine eigene Marker-Kategorie/Icon für „Foto-/Selfie-Spots"** (z. B. Kamera-Icon), damit Leah & Maxi die besten Fotopunkte direkt auf der Karte sehen. Bei Tab-Wechsel zoomt die Karte auf die Route des jeweiligen Tages/der Etappe. Karte muss zwischen den drei weit auseinanderliegenden Standorten (Agios Gordios, Ksamil, Ýpsos) sauber umschalten können. Map-Höhe bei Breakpoint ≤480px reduzieren.

3. **ROUTE-Modal (Routen-Guide)**: Turn-by-turn-Wegbeschreibungen für JEDE Etappe aller Tage — inklusive Anreise (Auto Plankenwarth→Hauptbahnhof Graz, Zug OS3588, Flug OS863, Transfer zur Unterkunft Agios Gordios), der Fährverbindung Korfu→Ksamil und zurück, sowie der Rückreise (Flug OS862, Flug OS117, Abholung Flughafen Graz→Plankenwarth). Strecken vor Ort mit Gehzeiten, ggf. Bus-/Taxiverbindungen wo sinnvoll. Die Routen-Daten müssen exakt mit der Tagesübersicht übereinstimmen — kein Stopp darf fehlen!

4. **TODO-Modal**: Pre-Trip-Checkliste (Reisepass/Ausweis — Albanien ist NICHT EU/Schengen, ggf. Passpflicht statt nur Personalausweis prüfen!, Online-Check-in AUA, Fährtickets Korfu–Saranda vorab buchen/prüfen, Sonnenschutz & Hitze-Ausrüstung für Kinder, Schwimmsachen, Bargeld in Albanien (Lek) vs. Euro auf Korfu, Mietwagen/Transfer-Reservierungen, Roaming-Hinweis Albanien (kein EU-Land → ggf. Roaming-Kosten außerhalb EU-Tarif!) etc.) mit Checkboxen und **localStorage-Persistenz**.

5. **Fotos der Sehenswürdigkeiten**: AUSSCHLIESSLICH stabile Wikimedia-URLs im Format `https://commons.wikimedia.org/wiki/Special:FilePath/DATEINAME.jpg?width=600` verwenden. KEINE Unsplash-Links, KEINE Wikipedia-Thumbnail-URLs (`upload.wikimedia.org/.../thumb/...`) — die brechen erfahrungsgemäß. Prüfe jede Bild-URL per Request, bevor du sie einbaust.

6. **Wetter-Hinweis-Box**: Hochsommer-Hitze in Griechenland/Albanien (Ende Juli/Anfang August oft 30°C+) — eine charmante kleine „Hitze-Alarm"-Box mit Packtipps (Sonnencreme, Hut, viel Wasser, Mittagsruhe für die Kinder) passt perfekt zum verspielten Stil.

## Technische Anforderungen
- Eine einzige `index.html`, komplett self-contained (CSS/JS inline, Fonts + Leaflet via CDN)
- Comic-Avatare aus den Porträtfotos: falls lokale Bilddateien übergeben werden, diese als Assets einbinden bzw. referenzieren; sonst Platzhalter laut obigem Hinweis verwenden
- Mobile-first testen: Breakpoints bei 768px und 480px
- Performance: Datei unter ~1,5 MB halten
- Lege die fertige Datei so ab, dass sie direkt in einen Deploy-Unterordner kopiert und mit `npx wrangler pages deploy . --project-name=...` veröffentlicht werden kann (Hinweis: Cloudflare Pages will die index.html in einem Ordner, nicht als Einzeldatei)
- Teste am Ende selbst: Öffne die Datei, prüfe ob alle Tabs, Modals, Karte und localStorage funktionieren, und prüfe alle Bild-URLs auf HTTP 200

---
