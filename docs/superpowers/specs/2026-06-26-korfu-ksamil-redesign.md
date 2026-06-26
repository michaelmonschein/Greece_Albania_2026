# Design Spec: Korfu & Ksamil 2026 — Living Travel Experience

**Datum:** 2026-06-26  
**Projekt:** `/Holiday Projects/Korfu_Ksamil_July_2026/deploy/index.html`  
**Ziel:** Kompletter Neubau der bestehenden index.html als immersives, tagesbasiertes Reiseerlebnis

---

## 1. Kern-Philosophie

Keine Fakten-Präsentation — ein **lebendes Reise-Tagebuch**. Die Seite verändert sich täglich, belohnt tägliches Aufrufen und inszeniert jeden der 17 Urlaubstage als eigenes Kapitel einer Familiengeschichte.

Stil-Referenz: Apple Editorial trifft mediterranes Reisemagazin. Warm, lebendig, cinematisch — niemals steril oder kindisch.

---

## 2. Visuelle Identität

### Farbsystem
| Rolle | Farbe | Hex |
|---|---|---|
| Primär (Meer) | Ägäischblau | `#1a7abf` |
| Primär hell | Himmelblau | `#5bb8f5` |
| Primär tief | Tiefsee | `#0a3d6b` |
| Akzent | Terrakotta | `#c4622d` |
| Natur | Olivgrün | `#5c7a3e` |
| Warm | Sand/Creme | `#f8f4ee` / `#f2e4c4` |
| Energie | Zitronengelb | `#ffe566` |
| Text | Dunkelblau | `#1a2c45` |
| Subtitel | Graublau | `#5a7a9a` |

### Typografie
- **Display / Headlines:** Playfair Display, weight 900, via Google Fonts
- **UI / Body:** Nunito, weight 400/700/800, via Google Fonts
- **Mono / Tags:** Space Mono, weight 400/700, via Google Fonts

### Animationen (Emil-Kowalski-Qualität)
- Alle Übergänge: `cubic-bezier(0.34, 1.2, 0.64, 1)` — leicht overshoot, lebendig
- Karten-Einblendung: `opacity 0→1` + `translateY(20px→0)`, gestaffelt mit 60ms Delay
- Tag-Freischaltung: Kurzer Scale-Pulse (`1→1.05→1`) + Glow-Effekt
- Scroll-Parallax: CSS `background-attachment: fixed` + JS scroll-listener für Hero-Layer
- Tabs/Timeline: Smooth horizontal scroll, aktiver Tab zentriert sich automatisch
- Keine swipe-Gesten (iOS Safari unzuverlässig) — nur touch-action: pan-x

---

## 3. Drei Phasen der Seite

Die Seite erkennt automatisch welche Phase aktiv ist, basierend auf `new Date()`.

### Phase 1: Pre-Trip (jetzt → 17. Juli 2026)
**Hero:** Großer animierter Countdown-Hero
- Animierte CSS-Mittelmeer-Szene im Hintergrund (Sonne, Wellen, Silhouetten)
- Zentriert: Große Zahl `22 TAGE` mit Label „bis Korfu"
- Zahl wechselt täglich automatisch
- Darunter: „Nächste Station" — Vorschau auf Etappe 1

**Timeline:** Alle 17 Tage sichtbar, aber visuell „gesperrt" (gedimmt, 🔒-Icon, kein Inhalt)

**Sichtbar:** Checkliste (TODO-Modal), Karte (Gesamtroute), Route-Modal

### Phase 2: Während des Urlaubs (18. Juli → 3. August 2026)
**Hero:** Transformiert sich täglich
- „HEUTE: TAG 3 — PALEOKASTRITSA" in großer Typografie
- Animierte CSS-Szene passend zum heutigen Ziel (Meeresbucht, Stadtkulisse, Strand)
- Szene und Farbtemperatur wechseln täglich automatisch

**Timeline-Verhalten:**
- Vergangene Tage: gedimmt, grüner ✓-Badge
- Heute: leuchtet auf, blaues Glow, „HEUTE"-Badge
- Zukünftige Tage: gesperrt, grau, 🔒

**Freischalt-Animation:** Wenn ein neuer Tag startet, erscheint beim ersten Öffnen eine kurze „✨ Tag X freigeschaltet"-Animation über der Tageskarte

**Sichtbar:** Alle bisherigen Features + aktiver Tagesplan prominent

### Phase 3: Nach dem Urlaub (ab 4. August 2026)
**Hero:** „17 unvergessliche Tage" mit einem schönen Rückblick-Layout
**Timeline:** Alle Tage entsperrt, alle mit ✓, als Erinnerungsarchiv durchblätterbar
**Karte:** Zeigt die vollständige Reiseroute als Gesamtbild

---

## 4. Preview-Modus

**Auslöser:** URL-Parameter `?preview` (z.B. `https://korfu2026.pages.dev?preview`)

**Verhalten im Preview-Modus:**
- Alle 17 Tage vollständig entsperrt und lesbar
- Phase-Logik umgangen — alle Inhalte sichtbar
- Diskreter Banner oben: `👁 Preview-Modus · Familie sieht die zeitgesteuerte Version`
- Banner ist dezent (kleine Leiste, nicht störend)
- Preview-Zustand wird NICHT in localStorage gespeichert — jeder Aufruf mit `?preview` aktiviert ihn neu

**Familie-URL:** normale URL ohne Parameter — sieht immer die zeitgesteuerte Version

---

## 5. Seiten-Layout

### Desktop (≥768px)
```
┌─────────────────────────────────────────────────┐
│  HEADER: Logo + Buttons (Route / Checkliste)    │
├─────────────────────────────────────────────────┤
│  PHASE HERO (vollbreit, animiert, ~340px hoch)  │
├─────────────────────────────────────────────────┤
│  TIMELINE: Etappen-Labels + scrollbare Tages-   │
│  Buttons (sticky unter dem Hero)                │
├───────────────────────────┬─────────────────────┤
│  CONTENT (scrollbar)      │  KARTE (sticky,     │
│  - Tageskarte(n)          │  400px breit)       │
│  - Selfie-Spots           │                     │
│  - Restaurants            │                     │
│  - Abendprogramm          │                     │
│  - Tipps                  │                     │
└───────────────────────────┴─────────────────────┘
```

### Mobile (≤768px)
```
┌────────────────────┐
│  HEADER            │
│  PHASE HERO        │
│  KARTE (260px)     │
│  TIMELINE          │
│  CONTENT           │
└────────────────────┘
```

---

## 6. Phase Hero — Szenen pro Etappe

Jede Szene ist eine gestapelte CSS-Animation mit mehreren Ebenen:

| Etappe / Kontext | Szene | Farbtöne |
|---|---|---|
| Pre-Trip | Abstrakte Mittelmeer-Silhouette mit Countdown | Creme → Blau |
| Anreise (T1, T17) | Stilisiertes Flugzeug + Wolken | Grau-Blau |
| Agios Gordios (T2–T8) | Strand + Sonne + Wellen + Boot | Hellblau + Sand |
| Ksamil (T9–T12) | Vorgelagerte Inseln + türkises Wasser + Palme | Türkis + Grün |
| Ýpsos (T13–T16) | Ruhigere Bucht + Berge im Hintergrund | Tiefblau + Grün |
| Korfu-Stadt (T4, T15) | Venezianische Festung-Silhouette + Sonnenuntergang | Ocker + Terrakotta |
| Post-Trip | Sternenhimmel + Erinnerungs-Mosaik | Tief-Marineblau |

---

## 7. Tages-Erfahrungs-Karte (Deep Card)

Aufbau einer vollständig aufgeklappten Tageskarte:

```
┌─────────────────────────────────────────────┐
│  HERO: Animierte Szene (etappenspezifisch)  │
│  + Tages-Datum + Titel + Untertitel (200px) │
├─────────────────────────────────────────────┤
│  ALERTS (falls vorhanden: Reisepass etc.)   │
├─────────────────────────────────────────────┤
│  AKTIVITÄTEN-LISTE (mit Icon + Text)        │
├─────────────────────────────────────────────┤
│  FOTOS (2-spaltig, Wikimedia-URLs)          │
├─────────────────────────────────────────────┤
│  📸 SELFIE & FOTO-SPOTS (gelbe Box)         │
├─────────────────────────────────────────────┤
│  🍴 RESTAURANTS & CAFÉS                     │
├─────────────────────────────────────────────┤
│  🌆 ABENDPROGRAMM                           │
├─────────────────────────────────────────────┤
│  💡 TIPPS                                   │
└─────────────────────────────────────────────┘
```

Der Karten-Header-Hero ersetzt den simplen farbigen Balken der alten Version durch eine kleine animierte CSS-Szene (sparsam, nicht ablenkend).

---

## 8. Avatare & Splash

### Splash (max. 10 Sekunden, Skip-Button)

**Szene:** Mittelmeer-Panorama animiert herein (Sonne steigt auf, Wellen bewegen sich, Inseln tauchen auf). Dann erscheinen die vier Portraits nacheinander über dem Horizont, ihre Namen werden eingeblendet.

**Portrait-Stil:** Zeitgemäße Editorial-Illustration — klare Gesichtszüge, erkennbare Charakteristika, nicht kindisch. SVG-basiert.

**Portraits basierend auf IMG_7167.jpeg:**

| Person | Charakteristika |
|---|---|
| **Michael** | Sonnenbrille (blau/verspiegelt), kurzes Haar, warmes Lächeln, blaues Shirt |
| **Nina** | Markante rote eckige Brille, schwarzes Haar (schulterlang), helles Oberteil, silberne Uhr |
| **Maxi** | Junge (13), dunkles lockiges Haar, breites Grinsen, schwarzes T-Shirt |
| **Leah** | Teenager (15), langes dunkles glattes Haar, Sonnenbrille auf dem Kopf, lila/farbiges Oberteil |

### Nach dem Splash
Die vier kleinen Avatar-Icons erscheinen im Header neben dem Logo — als dauerhaftes Familien-Signet.

---

## 9. Karte (Leaflet)

Keine Änderungen an der Karten-Logik — nur visuelles Polishing:
- Custom Tile-Layer: `CartoDB Positron` statt OpenStreetMap (cleaner, besser zum Stil)
- Marker-Icons: größer, mit Schatten, etappen-farbcodiert
- Selfie-Spot-Marker: Kamera-Icon, Zitronengelb
- Hotel-Marker: Haus-Icon, Olivgrün
- Fähre-Marker: Boot-Icon, Türkis
- Beim Tab-Wechsel: sanfte Kamera-Animation zum neuen Bounds

---

## 10. Modals (Route & Checkliste)

**Kein Redesign des Inhalts** — nur visuelles Upgrade:
- Bottom-Sheet mit stärkerem Backdrop-Blur
- Mhandle-Animation beim Öffnen
- Route-Modal: Timeline-Schritte mit schöneren Verbindungslinien
- Todo-Modal: Fortschrittsbalken prominenter, Gruppen besser abgesetzt

---

## 11. Technische Anforderungen

- **Eine einzige `index.html`** — alle CSS/JS inline, Fonts + Leaflet via CDN
- **Datei unter 1.5 MB**
- **Keine Build-Tools** — direkt deploybar mit `npx wrangler pages deploy`
- **iOS Safari optimiert** — touch-action: pan-x, -webkit-overflow-scrolling: touch
- **Breakpoints:** 768px (Tablet/Desktop-Split), 480px (kleines Mobil)
- **localStorage:** Checklist-State unter Key `korfu26_todo`
- **Phase-Erkennung:** `new Date()` gegen Reisedaten (18.07.–03.08.2026)
- **Preview-Modus:** `new URLSearchParams(window.location.search).has('preview')`
- **Bild-URLs:** Ausschließlich `commons.wikimedia.org/wiki/Special:FilePath/...?width=600`

---

## 12. Was bleibt erhalten

- Alle 17 Tages-Datensätze (DAYS-Array) — Inhalte bleiben, nur Präsentation neu
- Alle TODO-Items (27 Aufgaben) mit localStorage-Persistenz
- Route-Guide HTML-Inhalt (ROUTE_HTML)
- Leaflet.js Karten-Logik
- Alle Bild-URLs (bereits verifiziert)
- Alle Map-Locations (LOCS-Objekt)

---

## 13. Was komplett neu ist

- Phase-aware Hero (Countdown / Heute / Archiv)
- Animierte CSS-Szenen pro Etappe
- Day-Unlock-Mechanic mit Animation
- Preview-Modus (`?preview`)
- Alle 4 Avatar-Portraits (erkennbar, nicht kindisch)
- Animierter Splash mit mediterraner Panorama-Szene
- CartoDB-Karte statt OpenStreetMap
- Tages-Karten mit animierten Hero-Szenen
- Familien-Avatar-Signet im Header
- Phase-aware Pre-Trip Hero mit Countdown
