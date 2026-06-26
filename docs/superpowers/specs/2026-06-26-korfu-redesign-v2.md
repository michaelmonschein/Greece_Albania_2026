# Design Spec v2: Korfu & Ksamil 2026 — Epic-Style Immersive Reise-App

**Datum:** 2026-06-26
**Projekt:** `/Holiday Projects/Korfu_Ksamil_July_2026/deploy/index.html`
**Ziel:** Kompletter Neubau der index.html als immersives, Smartphone-optimiertes Reiseerlebnis im Stil von epic.com — fließende Foto-Integration, keine Emojis, kontextuelle Pixar-Avatare, Bottom-Tab-Navigation.

---

## 1. Kern-Philosophie

Kein Informationsportal — ein **lebendes Reise-Magazin**. Jeder der 17 Urlaubstage ist eine eigene Magazinseite, die man horizontal durchblättert. Echte Fotos von Korfu und Ksamil bluten organisch in Crème-Weiß aus. Die Pixar-Familie begleitet jeden Tag im passenden Kontext. Keine Emoji, keine Card-Schatten, keine überladene UI.

Stil-Referenz: epic.com trifft griechisches Reisemagazin. Aquarell-Kanten, Playfair Display Typografie, Ägäischblau als Signalfarbe.

---

## 2. Farbsystem

| Rolle | Name | Hex |
|---|---|---|
| Primär | Tiefsee | `#0d3b5e` |
| Akzent | Ägäisch | `#1a6b9a` |
| Hell | Horizont | `#5ba3c9` |
| Hintergrund | Sand-Crème | `#f7f2eb` |
| Karten-Weiß | Warm-Weiß | `#fefcf8` |
| Text Primär | Tintenschwarz | `#1a2332` |
| Text Sekundär | Blaugrau | `#5a7a8a` |
| Etappe 1 | Agios-Blau | `#1a6b9a` |
| Etappe 2 | Ksamil-Türkis | `#2a9d8f` |
| Etappe 3 | Ýpsos-Grün | `#5c7a3e` |
| Transfer | Neutral | `#8a9aaa` |

CSS Custom Properties unter `:root`, alle Farben über Variablen referenziert.

---

## 3. Typografie

| Zweck | Font | Weight | Stil |
|---|---|---|---|
| Tagesnamen, Orte | Playfair Display | 700/900 | Italic möglich |
| Datum, Labels, Kapitel | Space Mono | 400/700 | Uppercase, 0.1em tracking |
| Fließtext, Listen | Nunito | 400/600/800 | — |

Via Google Fonts CDN. Keine Emoji in der UI. Icons ausschließlich aus Lucide Icons (SVG, inline).

---

## 4. Seitenarchitektur

### 4.1 HTML-Struktur

```
body
├── #splash                    (Intro-Sequenz)
├── #app  (hidden bis splash fertig)
│   ├── #app-header            (Logo + 2 Icon-Buttons)
│   ├── #day-viewport          (Vollbild Tag-Karte, wischbar)
│   │   └── .day-card[data-id] (eine pro Tag, 17 total)
│   ├── #tab-dots              (Positions-Dots über Bottom-Nav)
│   └── #bottom-nav            (3 Etappen-Tabs)
├── #modal-route               (Route-Overlay)
└── #modal-todo                (Checkliste-Overlay)
```

### 4.2 Header

Höhe: 52px. Fixiert oben. Hintergrund: transparent über Foto, solid `#fefcf8` ab Inhaltsbereich.

- Links: "Korfu 2026" in Playfair Display, `#0d3b5e`
- Rechts: 2 Lucide Icons — `list-checks` (Checkliste) + `map` (Route), je 24px, `#0d3b5e`

### 4.3 Bottom Navigation

Fixiert unten. Höhe: 64px + Safe Area (iOS). Hintergrund: `#fefcf8` mit 1px Top-Border `#e8e0d5`.

3 Tabs:
- **Agios Gordios** (T1–T5, inkl. Transfer) — aktiv: `#1a6b9a`
- **Ksamil** (T6–T11) — aktiv: `#2a9d8f`
- **Ýpsos** (T12–T16, inkl. Transfer + T17 Rückreise) — aktiv: `#5c7a3e`

Aktiver Tab: Farb-Underline (3px), Text leicht fett. Inaktiv: `#5a7a8a`.

### 4.4 Positions-Dots

Über dem Bottom-Nav. Kleine Kreise (6px) zeigen aktive Position innerhalb der Etappe. Aktiver Dot: etappenfarbe, ausgefüllt. Inaktive: Outline.

---

## 5. Splash / Intro-Erlebnis

Einmalig beim ersten Besuch (localStorage Key `korfu26_splash`). Mit `?splash` in der URL immer auslösbar.

### Ablauf (4 Sekunden)

**Phase 1 (0–1.8s):** Ägäischblau-Vollbild-Hintergrund (`#0d3b5e`).
- Familiengruppe `av-strand.png` erscheint zentriert mit `fadeUp`-Animation
- Darunter: "Familie Monschein" — Playfair Display, weiß, 1.4rem
- "Korfu & Ksamil · Juli 2026" — Space Mono, `#5ba3c9`, 0.75rem

**Phase 2 (1.8–3.6s):** Route erscheint:
- SVG-Pfad zeichnet sich von links nach rechts auf (stroke-dashoffset Animation)
- Punkte: Graz → Korfu (CFU) → Ksamil → Ýpsos → Graz
- Datum-Labels in Space Mono erscheinen zeitversetzt
- Linien-Stil: handgezeichnet wirkend, `#5ba3c9`, 1.5px, kein perfektes Gerade

**Phase 3 (3.6–4.0s):** Cross-Fade zur Hauptseite.

**Skip-Button:** "Überspringen" — Space Mono, 0.65rem, `rgba(255,255,255,0.5)`, oben rechts, immer sichtbar.

---

## 6. Die Tages-Karte (Day Card)

Herzstück der Anwendung. Jeder der 17 Tage ist eine `.day-card`.

### 6.1 Struktur

```
.day-card
├── .card-photo-zone        (60vh)
│   ├── img.card-photo      (Wikimedia-Foto, object-fit: cover)
│   ├── .photo-overlay      (Gradient links oben für Lesbarkeit)
│   └── .watercolor-edge    (SVG organic path, Aquarell-Übergang)
├── .card-content-zone      (scrollbar, min 40vh)
│   ├── .card-meta          (Datum + Wochentag in Space Mono)
│   ├── .card-title         (Ort/Titel in Playfair Display)
│   ├── .card-sub           (Untertitel in Nunito)
│   ├── .card-avatar        (kontextuelles Familienbild)
│   ├── .card-highlights    (2–3 Top-Highlights als Liste)
│   ├── .card-scroll-hint   (Lucide chevron-down, animiert)
│   └── .card-details       (alles weitere, scrollbar)
│       ├── .section-acts   (vollständige Aktivitäten)
│       ├── .section-selfie (Foto-Spots)
│       ├── .section-rests  (Restaurants)
│       ├── .section-eve    (Abendprogramm)
│       └── .section-tips   (Tipps)
└── .card-alerts            (Warnhinweise, falls vorhanden)
```

### 6.2 Foto-Integration (Aquarell-Effekt)

```css
.watercolor-edge {
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 120px;
}
/* SVG mit organischem clip-path, verschiedene Varianten rotierend */

.card-photo {
  mask-image: linear-gradient(
    to bottom,
    black 0%, black 55%,
    transparent 88%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    black 0%, black 55%,
    transparent 88%
  );
}
```

3 verschiedene SVG Aquarell-Edge-Varianten werden per `data-et` Attribut dem Etappen-Typ zugeordnet — Agios, Ksamil und Ýpsos haben leicht unterschiedliche Pinselstrich-Formen.

Seitliche Verblendung:
```css
.card-photo::after {
  background: linear-gradient(
    90deg,
    rgba(247,242,235,0.15) 0%,
    transparent 10%,
    transparent 90%,
    rgba(247,242,235,0.15) 100%
  );
}
```

### 6.3 Avatar-Zuweisung

Jeder Tag bekommt einen Avatar basierend auf dem Tagestyp (field `avt` im DAYS-Array):

| `avt` Wert | Datei | Szene |
|---|---|---|
| `airport` | `av-airport.png` | IMG_9831 — Flughafen |
| `ferry` | `av-faehre.png` | IMG_9832 — Fähre |
| `beach` | `av-picknick.png` | IMG_9833 — Strand-Picknick |
| `sport` | `av-sport.png` | IMG_9828 — Wassersport |
| `bar` | `av-bar.png` | IMG_9829 — Strandbar |
| `taverna` | `av-taverna.png` | IMG_9830 — Taverna |
| `evening` | `av-abend.png` | IMG_9827 — Cocktail-Abend |
| `group` | `av-strand.png` | IMG_9826 — Strandgruppe |

Avatar-Bild: `width: 100%`, `max-width: 340px`, zentriert, `mix-blend-mode: multiply` (weißer Hintergrund verschwindet auf Crème). Kein Rahmen, kein Schatten, keine Kreise.

### 6.4 Highlights-Liste

2–3 Top-Aktivitäten aus dem `acts`-Array des Tages (die ersten 2–3 Einträge). Darstellung:

```
HEUTE BESONDERS
─────────────────────────────
  Agios Gordios Strand        ← Nunito 600, #1a2332
  Erster Sonnenuntergang      ← Nunito 600, #1a2332
  Pink Panther Beach Bar      ← Nunito 600, #1a2332
─────────────────────────────
```

Kein Emoji, kein Icon. Nur Text + feine `1px solid #e8e0d5` Trennlinie.

### 6.5 Detail-Bereich (unterhalb fold)

Section-Überschriften in Space Mono Uppercase (`AKTIVITÄTEN`, `SELFIE-SPOTS`, `RESTAURANTS`, `ABENDS`, `TIPPS`). Darunter Inhalte als schlichte Liste. Viel Weißraum. Keine Card-Schatten.

Restaurants: Name fett + Nunito 700, Tags als kleine Pill-Labels (outline, `#5a7a8a`, 0.6rem Space Mono).

Alerts (Warnhinweise): Horizontal-Bar in `#0d3b5e` mit weißem Text — dezent aber lesbar.

### 6.6 Phasen-Verhalten

**Pre-Trip (vor 18.07.2026):**
- Foto-Zone: Aquarell-Korfu-Bild (Agios Gordios) + Countdown overlay
- Großes `23` (Tage) in Playfair Display, `#fefcf8`
- "TAGE BIS KORFU" in Space Mono
- Darunter: "Erste Station: Agios Gordios · 18. Juli"
- Alle Tages-Karten entsperrt im Preview-Modus (`?preview`), sonst gesperrt

**During Trip (18.07–03.08.2026):**
- Heute-Karte automatisch aktiv beim Öffnen
- Vergangene Tage: leicht gedimmt (opacity 0.7), kleines Checkmark-Icon (Lucide `check`)
- Heutige Karte: feiner Glow-Ring in Etappenfarbe um die Dots
- Zukünftige Tage: Foto-Zone mit Blur-Overlay + Lucide `lock` Icon zentriert

**Post-Trip (ab 04.08.2026):**
- Alle Karten entsperrt, alle mit Checkmark
- Erste Karte zeigt: "17 unvergessliche Tage" als Hero-Text

---

## 7. Swipe-Navigation

Touch-basiert via Pointer Events API (kein Hammer.js, kein externes Framework).

```javascript
// Swipe-Logik: horizontal > 40px = Karten-Wechsel
// Innerhalb einer Karte: vertikal = normales Scrollen
// Etappen-Wechsel: Bottom-Tab anklicken
// Direkt zu einem Tag: Tab + Dot-Index
```

Animations-Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — sanft, kein Overshoot beim Wischen.

Transition beim Tab-Wechsel: Cross-Fade (300ms) statt Slide — verhindert Richtungs-Verwirrung bei Etappen-Sprüngen.

---

## 8. DAYS-Array Erweiterung

Jeder Tag erhält ein neues Feld `avt` (Avatar-Typ):

```javascript
{id:"T1",  avt:"airport",  ...}  // Anreise
{id:"T2",  avt:"beach",    ...}  // Ankommen Strand
{id:"T3",  avt:"sport",    ...}  // Wassersport
{id:"T4",  avt:"evening",  ...}  // Korfu-Stadt Abend
{id:"T5",  avt:"ferry",    ...}  // Transfer Fähre
{id:"T6",  avt:"beach",    ...}  // Ksamil Erste Strände
{id:"T7",  avt:"sport",    ...}  // Inseln & Schnorcheln
{id:"T8",  avt:"taverna",  ...}  // Butrint (Kultur-Tag → Taverna abends)
{id:"T9",  avt:"evening",  ...}  // Saranda & Lëkurësi
{id:"T10", avt:"sport",    ...}  // Ksamil Wassersport
{id:"T11", avt:"bar",      ...}  // Freier Strandtag + Bar
{id:"T12", avt:"ferry",    ...}  // Transfer → Ýpsos
{id:"T13", avt:"group",    ...}  // Paleokastritsa
{id:"T14", avt:"sport",    ...}  // Ýpsos Wassersport
{id:"T15", avt:"taverna",  ...}  // Achilleion + Korfu-Stadt
{id:"T16", avt:"beach",    ...}  // Letzter freier Tag
{id:"T17", avt:"airport",  ...}  // Rückreise
```

---

## 9. Karte (Leaflet)

Zugänglich über das Map-Icon im Header → öffnet `#modal-route` als Bottom-Sheet.

- CartoDB Positron Tiles (wie bisher)
- Marker: etappenfarb-codiert, größer, ohne Emoji
- Beim Öffnen: fly-to auf die aktive Etappe

---

## 10. Modals

**Bottom-Sheet-Stil:** Schiebt von unten herein, Backdrop-Blur `blur(8px)` über dem Inhalt. Handle-Bar oben (32px breiter Strich). Schließen via Swipe-Down oder X-Button.

**Route-Modal:** Reiseroute als vertikale Timeline mit Verbindungslinien. Orte als Kreis-Marker in Etappenfarbe.

**Todo-Modal:** Fortschrittsbalken oben, Gruppen mit Checkbox-Listen. localStorage-Persistenz unter `korfu26_todo`.

---

## 11. Technische Constraints

- **Eine einzige `index.html`** — alle CSS/JS inline, Fonts + Leaflet + Lucide via CDN
- **Ziel: unter 2MB Gesamt** (Bilder in deploy/ bereits vorhanden)
- **Keine Build-Tools** — direkt deploybar mit `npx wrangler pages deploy deploy/`
- **iOS Safari optimiert** — `env(safe-area-inset-bottom)` für Bottom-Nav, `-webkit-overflow-scrolling: touch`
- **Breakpoints:** 768px (Tablet ab hier: Karte neben Inhalt sichtbar statt Modal)
- **localStorage Keys:** `korfu26_todo` (Checkliste), `korfu26_splash` (Splash gesehen)
- **Preview-Modus:** `?preview` in URL — alle Tage entsperrt
- **Bild-URLs:** `commons.wikimedia.org/wiki/Special:FilePath/...?width=800`

---

## 12. Foto-Mapping (Wikimedia URLs)

| Tag-Typ | Foto-Key | Beschreibung |
|---|---|---|
| Agios Gordios | `agiosGordios` | Corfu Agios Gordis R04.jpg |
| Korfu-Stadt | `korfuTown` | Corfu Town aerial.jpg |
| Alte Festung | `oldFortress` | Old Fortress Corfu.jpg |
| Paleokastritsa | `paleokastritsa` | Paleokastritsa bay.jpg |
| Ksamil | `ksamil` | Ksamil beach Albania.jpg |
| Ksamil Riviera | `ksamilRiviera` | Ksamil islands.jpg |
| Butrint | `butrint` | Butrint ruins.jpg |
| Blaues Auge | `blueEye` | Blue Eye Albania.jpg |
| Korfu Aerial | `korfuAerial` | Corfu aerial view.jpg |
| Achilleion | `achilleion` | Achilleion palace.jpg |
| Pontikonisi | `pontikonisi` | Pontikonisi Corfu.jpg |

(Exakte URLs aus bestehendem Code übernehmen — alle bereits verifiziert)

---

## 13. Was komplett neu ist vs. was bleibt

### Neu
- Komplettes CSS Design System (Farbvariablen, Typografie, Layout)
- Splash mit Route-Animation
- Bottom-Tab-Navigation + Swipe-Navigation
- Full-Bleed Day Cards mit Aquarell-Foto-Integration
- Avatar-Zuweisung pro Tag via `avt`-Feld
- Section-Label-Stil (Space Mono Uppercase, kein Emoji)
- Modal als Bottom-Sheet
- Phase-aware Card-Zustände (Pre/During/Post)

### Bleibt erhalten
- Alle 17 DAYS-Datensätze (nur `avt`-Feld wird ergänzt)
- Alle TODO-Items (27 Stück) mit localStorage
- ROUTE_HTML Inhalt
- Leaflet.js Karten-Logik + LOCS-Objekt
- Alle Wikimedia Foto-URLs
- Alle Map-Locations
- Phase-Erkennung (`getPhase()`)
- Preview-Modus (`?preview`)
