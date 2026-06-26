# Korfu & Ksamil 2026 — Living Travel Experience: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kompletter Neubau der `deploy/index.html` als phasengesteuertes, täglich lebendes Reise-Erlebnis mit mediterranem Editorial-Design und cinematischer Tiefe.

**Architecture:** Eine einzige self-contained `index.html` mit inline CSS/JS. Die Seite erkennt automatisch die aktuelle Phase (Pre-Trip / During-Trip / Post-Trip) via `new Date()` und rendert entsprechend unterschiedliche Hero-Sektionen, Timeline-Zustände und Karten-Overlays. Ein `?preview`-URL-Parameter bypassed die Phase-Logik und schaltet alle Inhalte frei.

**Tech Stack:** Vanilla JS (ES6+), CSS Custom Properties, Leaflet.js 1.9.4 via CDN, Google Fonts (Playfair Display + Nunito + Space Mono), CartoDB Positron Tile-Layer, keine Build-Tools.

## Global Constraints

- Einzige Ausgabedatei: `deploy/index.html` — alle CSS/JS inline, nur Fonts + Leaflet via CDN
- Maximale Dateigröße: 1.5 MB
- Kein swipe-Handling (iOS Safari) — nur `touch-action: pan-x` + `-webkit-overflow-scrolling: touch`
- Breakpoints: 768px (Desktop-Split) und 480px (kleines Mobil)
- Bild-URLs: ausschließlich `https://commons.wikimedia.org/wiki/Special:FilePath/DATEINAME.jpg?width=600`
- localStorage Key für Checklist: `korfu26_todo`
- Reisedaten: 18.07.2026 (TRIP_START) bis 03.08.2026 (TRIP_END)
- Phase-Erkennung: `new URLSearchParams(window.location.search).has('preview')` für Preview-Modus
- Deploybar mit: `npx wrangler pages deploy . --project-name=korfu-ksamil-2026`

---

### Task 1: HTML-Skeleton + CSS Design System

**Files:**
- Create: `deploy/index.html` (leere neue Datei — die alte bleibt als `deploy/index.html.bak`)

**Interfaces:**
- Produces: CSS Custom Properties (`--sea`, `--terra`, usw.), Basis-HTML-Struktur mit `#splash`, `#app`, `#preview-banner`, grundlegende Reset- und Typography-Rules

- [ ] **Schritt 1: Altes File sichern**

```bash
cp "deploy/index.html" "deploy/index.html.bak"
```

- [ ] **Schritt 2: Neue index.html anlegen — komplettes HTML-Skeleton**

Erstelle `deploy/index.html` mit folgendem Inhalt:

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>🌊 Korfu & Ksamil 2026 — Familie Monschein</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Nunito:wght@400;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
/* ── DESIGN SYSTEM ── */
:root {
  /* Farben */
  --sea:      #1a7abf;
  --sea2:     #5bb8f5;
  --sea3:     #c4eeff;
  --sea-deep: #0a3d6b;
  --terra:    #c4622d;
  --terra2:   #e8855a;
  --olive:    #5c7a3e;
  --olive2:   #8ab55a;
  --sand:     #f8f4ee;
  --sand2:    #f2e4c4;
  --lemon:    #ffe566;
  --lemon2:   #ffc200;
  --chalk:    #fdfcfa;
  --dark:     #1a2c45;
  --muted:    #5a7a9a;
  --muted2:   #8aa4bc;

  /* Etappen-Farben */
  --e1: #1a7abf;
  --e2: #c4622d;
  --e3: #5c7a3e;
  --tv: #4a5568;

  /* UI */
  --r:  14px;
  --r2: 22px;
  --sh: 0 4px 28px rgba(26,122,191,.12);
  --sh2: 0 8px 48px rgba(26,44,69,.18);

  /* Animationen */
  --ease-spring: cubic-bezier(0.34, 1.2, 0.64, 1);
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Nunito', sans-serif;
  background: var(--chalk);
  color: var(--dark);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
button { cursor: pointer; font-family: inherit; border: none; background: none; }
img { display: block; max-width: 100%; }
ul { list-style: none; }

/* ── PREVIEW BANNER ── */
#preview-banner {
  display: none;
  background: var(--dark);
  color: rgba(255,255,255,.85);
  font-size: .7rem;
  font-weight: 700;
  text-align: center;
  padding: 6px 16px;
  letter-spacing: .5px;
  position: sticky;
  top: 0;
  z-index: 9998;
}
#preview-banner.show { display: block; }

/* ── APP WRAPPER ── */
#app { opacity: 0; transition: opacity .6s var(--ease-out); min-height: 100vh; }
#app.vis { opacity: 1; }
</style>
</head>
<body>

<!-- Preview Banner -->
<div id="preview-banner">
  👁 Preview-Modus · Familie sieht die zeitgesteuerte Version
</div>

<!-- Splash -->
<div id="splash"></div>

<!-- App -->
<div id="app">
  <!-- Header -->
  <header id="app-hdr"></header>

  <!-- Phase Hero -->
  <section id="phase-hero"></section>

  <!-- Timeline -->
  <nav id="timeline-wrap"></nav>

  <!-- Main -->
  <div class="main-lay">
    <div class="content" id="content"></div>
    <div class="map-panel"><div id="map"></div></div>
  </div>
</div>

<!-- Modals -->
<div class="moverlay" id="modal-route">
  <div class="msheet">
    <div class="mhandle"></div>
    <div class="mhdr"><h2>🗺 Reiseroute</h2><button class="mclose" onclick="closeModal('route')">✕</button></div>
    <div id="route-content"></div>
  </div>
</div>
<div class="moverlay" id="modal-todo">
  <div class="msheet">
    <div class="mhandle"></div>
    <div class="mhdr"><h2>✅ Checkliste</h2><button class="mclose" onclick="closeModal('todo')">✕</button></div>
    <div class="todo-stat" id="todo-stat"></div>
    <div class="todo-prog"><div class="todo-bar" id="todo-bar"></div></div>
    <div id="todo-content"></div>
  </div>
</div>

<script>
// Datenlogik kommt in Task 2
// Splash kommt in Task 3
// Phase-Logik kommt in Task 4
// Rendering kommt in Task 5+
</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</body>
</html>
```

- [ ] **Schritt 3: Visuell prüfen**

`deploy/index.html` im Browser öffnen (Doppelklick oder `open deploy/index.html`).
Erwartung: Weißer leerer Hintergrund, Fonts laden (Network-Tab prüfen), kein JS-Fehler in der Konsole.

---

### Task 2: Daten-Layer + Phase-Erkennung

**Files:**
- Modify: `deploy/index.html` — `<script>`-Block mit Daten + Phase-Logik

**Interfaces:**
- Produces:
  - `TRIP_START` (Date), `TRIP_END` (Date)
  - `getPhase()` → `'pre' | 'trip' | 'post'`
  - `IS_PREVIEW` (boolean)
  - `DAYS` Array (aus alter Datei portiert, unveränderter Inhalt)
  - `TODOS` Array (aus alter Datei portiert)
  - `LOCS` Object (aus alter Datei portiert)
  - `ROUTE_HTML` String (aus alter Datei portiert)
  - `IMG` Object (aus alter Datei portiert)

- [ ] **Schritt 1: Daten aus index.html.bak extrahieren**

Die folgenden Blöcke aus `deploy/index.html.bak` 1:1 kopieren (Zeilen 439–812):
- `const IMG = {...}` (Zeile 439–453)
- `const LOCS = {...}` (Zeile 461–482)
- `const DAYS = [...]` (Zeile 487–732)
- `const TODOS = [...]` (Zeile 737–779)
- `const ROUTE_HTML = \`...\`` (Zeile 784–812)

- [ ] **Schritt 2: Phase-Logik in den `<script>`-Block einfügen**

Nach den Daten-Konstanten einfügen:

```javascript
/* ══ PHASE & PREVIEW ══ */
const TRIP_START = new Date('2026-07-18T00:00:00');
const TRIP_END   = new Date('2026-08-04T00:00:00'); // exklusiv (nach Tag 17)
const IS_PREVIEW = new URLSearchParams(window.location.search).has('preview');

function getPhase() {
  if (IS_PREVIEW) return 'preview';
  const now = new Date();
  if (now < TRIP_START) return 'pre';
  if (now >= TRIP_END)  return 'post';
  return 'trip';
}

// Gibt 0-basierter Tages-Index des aktuellen Reisetags zurück (-1 wenn kein Reisetag)
function getTodayIndex() {
  if (IS_PREVIEW) return -1;
  const now = new Date();
  const diff = Math.floor((now - TRIP_START) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff >= DAYS.length) return -1;
  return diff;
}

// Für einen DAYS-Eintrag: ist er vergangen / heute / zukünftig?
function getDayState(dayIndex) {
  if (IS_PREVIEW) return 'unlocked';
  const todayIdx = getTodayIndex();
  const phase = getPhase();
  if (phase === 'pre')  return 'locked';
  if (phase === 'post') return 'unlocked';
  // during trip:
  if (dayIndex < todayIdx)  return 'past';
  if (dayIndex === todayIdx) return 'today';
  return 'locked';
}
```

- [ ] **Schritt 3: Preview-Banner aktivieren**

Direkt nach den Konstanten:

```javascript
// Preview-Banner zeigen
if (IS_PREVIEW) {
  document.getElementById('preview-banner').classList.add('show');
}
```

- [ ] **Schritt 4: Browser-Test**

`deploy/index.html` öffnen. In der Browser-Konsole eingeben:
```javascript
console.log(getPhase());        // Erwartet: 'pre' (da Reise noch nicht begonnen)
console.log(IS_PREVIEW);        // Erwartet: false
console.log(getDayState(0));    // Erwartet: 'locked'
```

Dann `deploy/index.html?preview` öffnen:
```javascript
console.log(getPhase());        // Erwartet: 'preview'
console.log(IS_PREVIEW);        // Erwartet: true
console.log(getDayState(0));    // Erwartet: 'unlocked'
```

Auch Preview-Banner prüfen: bei `?preview` muss der Banner sichtbar sein.

---

### Task 3: Splash — Mediterrane Panorama-Szene + 4 Portraits

**Files:**
- Modify: `deploy/index.html` — CSS für Splash + JS `initSplash()`

**Interfaces:**
- Consumes: —
- Produces: `initSplash()` Funktion, ruft am Ende `endSplash()` auf (wird in Task 4 definiert)

- [ ] **Schritt 1: Splash-CSS einfügen** (in den `<style>`-Block, nach dem App-Wrapper-CSS)

```css
/* ══ SPLASH ══ */
#splash {
  position: fixed; inset: 0; z-index: 9999;
  background: linear-gradient(175deg, #f0f8ff 0%, #c4e8ff 35%, #5bb8f5 65%, #1a7abf 85%, #0a3d6b 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  overflow: hidden; transition: opacity .9s var(--ease-out);
}
#splash.out { opacity: 0; pointer-events: none; }

/* Sonne */
.sp-sun {
  position: absolute; top: 6vh; left: 50%; transform: translateX(-50%);
  width: clamp(70px,12vw,110px); height: clamp(70px,12vw,110px);
  border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #fff9c4, #ffe566 35%, #ffc200 65%, rgba(255,150,0,0) 100%);
  box-shadow: 0 0 0 clamp(12px,2vw,24px) rgba(255,220,50,.18), 0 0 0 clamp(24px,4vw,48px) rgba(255,200,0,.09);
  animation: sunPulse 4s ease-in-out infinite;
}
@keyframes sunPulse {
  50% { box-shadow: 0 0 0 clamp(18px,3vw,36px) rgba(255,220,50,.25), 0 0 0 clamp(36px,6vw,72px) rgba(255,200,0,.12); }
}

/* Inseln */
.sp-island {
  position: absolute; border-radius: 50% 50% 0 0;
  background: linear-gradient(180deg, #6a9a4a, #4a7a2e);
}
.sp-island-l { width: 90px; height: 42px; bottom: 22%; left: 12%; }
.sp-island-r { width: 60px; height: 28px; bottom: 22%; right: 18%; }
.sp-island-sm { width: 38px; height: 18px; bottom: calc(22% + 20px); right: 30%; }

/* Meer */
.sp-sea {
  position: absolute; bottom: 0; left: 0; right: 0; height: 22%;
  background: linear-gradient(180deg, #1a7abf 0%, #0a3d6b 100%);
}
.sp-wave {
  position: absolute; left: -5%; right: -5%; border-radius: 50%;
  background: rgba(255,255,255,.22);
}
.sp-wave-1 { height: 28px; bottom: calc(22% + 14px); animation: waveFloat 5s ease-in-out infinite; }
.sp-wave-2 { height: 20px; bottom: calc(22% + 28px); animation: waveFloat 6.5s ease-in-out infinite reverse; }
@keyframes waveFloat {
  0%,100% { transform: scaleX(1) translateY(0); }
  50%      { transform: scaleX(1.04) translateY(-5px); }
}

/* Segelboot */
.sp-boat {
  position: absolute; bottom: calc(22% + 6px); left: 55%;
  opacity: 0; animation: boatAppear 1s var(--ease-spring) 2.8s forwards;
}
.sp-boat svg { width: 42px; height: 42px; }
@keyframes boatAppear { to { opacity: 1; } }

/* Titel */
.sp-title {
  position: relative; z-index: 10; text-align: center;
  opacity: 0; animation: fadeUp .7s var(--ease-spring) .3s forwards;
  margin-bottom: 10px;
}
.sp-title h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 900;
  color: #fff; text-shadow: 0 2px 24px rgba(10,40,80,.35);
  letter-spacing: -.5px;
}
.sp-title p {
  font-size: clamp(.75rem,2vw,1rem); color: rgba(255,255,255,.8);
  letter-spacing: 2.5px; text-transform: uppercase; margin-top: 5px;
  font-weight: 700;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Avatar-Reihe */
.sp-avatars {
  display: flex; gap: clamp(10px,3vw,28px);
  position: relative; z-index: 10; margin-top: 18px;
}
.sp-av {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  opacity: 0; transform: translateY(24px) scale(.9);
}
.sp-av.show {
  animation: avPop .55s var(--ease-spring) forwards;
}
@keyframes avPop {
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.sp-av-name {
  font-weight: 800; font-size: .75rem; color: #fff;
  letter-spacing: 1px; text-shadow: 0 1px 8px rgba(0,0,0,.3);
}

/* Skip-Button */
#skip-btn {
  position: absolute; top: 14px; right: 14px; z-index: 10001;
  background: rgba(255,255,255,.18); color: #fff;
  border: 1.5px solid rgba(255,255,255,.4); border-radius: 20px;
  padding: 5px 14px; font-size: .75rem; font-weight: 800;
  backdrop-filter: blur(6px); transition: background .2s;
}
#skip-btn:hover { background: rgba(255,255,255,.32); }
```

- [ ] **Schritt 2: Splash-HTML in `<div id="splash">` einfügen**

```html
<div id="splash">
  <button id="skip-btn" onclick="endSplash()">Überspringen ✕</button>

  <!-- Sonne -->
  <div class="sp-sun"></div>

  <!-- Inseln -->
  <div class="sp-island sp-island-l"></div>
  <div class="sp-island sp-island-r"></div>
  <div class="sp-island sp-island-sm"></div>

  <!-- Meer & Wellen -->
  <div class="sp-wave sp-wave-1"></div>
  <div class="sp-wave sp-wave-2"></div>
  <div class="sp-sea"></div>

  <!-- Segelboot -->
  <div class="sp-boat">
    <svg viewBox="0 0 42 42" fill="none">
      <polygon points="21,4 21,34 6,34" fill="rgba(255,255,255,0.9)"/>
      <polygon points="21,8 21,34 34,34" fill="rgba(255,255,255,0.6)"/>
      <rect x="9" y="34" width="24" height="4" rx="2" fill="#0a3d6b"/>
    </svg>
  </div>

  <!-- Titel -->
  <div class="sp-title">
    <h1>Korfu &amp; Ksamil</h1>
    <p>Sommer 2026 · Familie Monschein</p>
  </div>

  <!-- Avatare -->
  <div class="sp-avatars" id="sp-avatars">
    <!-- Michael -->
    <div class="sp-av" id="sp-av-0">
      <svg viewBox="0 0 90 110" width="72" height="88">
        <!-- Körper / Shirt (blau) -->
        <path d="M10,75 L5,108 L85,108 L80,75 Q65,84 45,84 Q25,84 10,75Z" fill="#1a7abf"/>
        <!-- Hals -->
        <rect x="37" y="64" width="16" height="14" fill="#f0b48a"/>
        <!-- Kopf -->
        <ellipse cx="45" cy="43" rx="27" ry="26" fill="#f0b48a"/>
        <!-- Kurzes Haar / sehr kurzer Haarschatten -->
        <ellipse cx="45" cy="22" rx="27" ry="10" fill="#6a4030" opacity=".55"/>
        <!-- Sonnenbrille (verspiegelt, blau) -->
        <rect x="17" y="35" width="21" height="12" rx="6" fill="#1a5fa8" opacity=".95"/>
        <rect x="52" y="35" width="21" height="12" rx="6" fill="#1a5fa8" opacity=".95"/>
        <rect x="37" y="39" width="16" height="4" fill="#0d3a6b"/>
        <ellipse cx="27" cy="41" rx="8" ry="4.5" fill="rgba(90,180,255,.35)"/>
        <ellipse cx="62" cy="41" rx="8" ry="4.5" fill="rgba(90,180,255,.35)"/>
        <!-- Lächeln -->
        <path d="M30,56 Q45,67 60,56" stroke="#c47a50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Wangen -->
        <circle cx="29" cy="54" r="5" fill="#ffb0a0" opacity=".35"/>
        <circle cx="61" cy="54" r="5" fill="#ffb0a0" opacity=".35"/>
      </svg>
      <span class="sp-av-name">Michael</span>
    </div>

    <!-- Nina -->
    <div class="sp-av" id="sp-av-1">
      <svg viewBox="0 0 90 110" width="72" height="88">
        <!-- Körper / helles Oberteil -->
        <path d="M12,73 L7,108 L83,108 L78,73 Q64,82 45,82 Q26,82 12,73Z" fill="#e8e4e0"/>
        <!-- Hals -->
        <rect x="38" y="62" width="14" height="13" fill="#f0b48a"/>
        <!-- Kopf -->
        <ellipse cx="45" cy="42" rx="25" ry="24" fill="#f0b48a"/>
        <!-- Schwarzes Haar (schulterlang, Seiten) -->
        <rect x="17" y="28" width="10" height="52" rx="5" fill="#0f0505"/>
        <rect x="63" y="28" width="10" height="52" rx="5" fill="#0f0505"/>
        <!-- Haar oben -->
        <path d="M19,38 Q21,14 45,13 Q69,14 71,38 Q63,21 45,21 Q27,21 19,38" fill="#0f0505"/>
        <!-- Rote eckige Brille -->
        <rect x="18" y="34" width="21" height="13" rx="3" fill="none" stroke="#cc1a1a" stroke-width="3"/>
        <rect x="51" y="34" width="21" height="13" rx="3" fill="none" stroke="#cc1a1a" stroke-width="3"/>
        <line x1="39" y1="40" x2="51" y2="40" stroke="#cc1a1a" stroke-width="2.2"/>
        <rect x="18" y="34" width="21" height="13" rx="3" fill="#ffe8e8" opacity=".2"/>
        <rect x="51" y="34" width="21" height="13" rx="3" fill="#ffe8e8" opacity=".2"/>
        <!-- Silberne Uhr-Andeutung -->
        <rect x="14" y="70" width="8" height="4" rx="1.5" fill="#c0c0c0" opacity=".8"/>
        <!-- Lächeln -->
        <path d="M30,52 Q45,63 60,52" stroke="#c47a50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="29" cy="51" r="5" fill="#ffb0a0" opacity=".4"/>
        <circle cx="61" cy="51" r="5" fill="#ffb0a0" opacity=".4"/>
      </svg>
      <span class="sp-av-name">Nina</span>
    </div>

    <!-- Maxi -->
    <div class="sp-av" id="sp-av-2">
      <svg viewBox="0 0 90 110" width="72" height="88">
        <!-- Körper / schwarzes T-Shirt -->
        <path d="M11,74 L6,108 L84,108 L79,74 Q65,83 45,83 Q25,83 11,74Z" fill="#1a1a1a"/>
        <!-- Hals -->
        <rect x="37" y="63" width="16" height="12" fill="#f0b48a"/>
        <!-- Kopf (runder, jünger) -->
        <circle cx="45" cy="43" r="27" fill="#f0b48a"/>
        <!-- Lockiges dunkles Haar -->
        <path d="M18,42 Q19,14 45,13 Q71,14 72,42 Q66,22 45,22 Q24,22 18,42" fill="#100808"/>
        <circle cx="22" cy="38" r="8" fill="#100808"/>
        <circle cx="68" cy="38" r="8" fill="#100808"/>
        <circle cx="33" cy="15" r="7" fill="#100808"/>
        <circle cx="57" cy="15" r="7" fill="#100808"/>
        <circle cx="45" cy="13" r="6" fill="#100808"/>
        <!-- Große Augen (junge Gesicht) -->
        <circle cx="35" cy="42" r="5" fill="#1a0800"/>
        <circle cx="55" cy="42" r="5" fill="#1a0800"/>
        <circle cx="36.5" cy="40.5" r="2" fill="#fff"/>
        <circle cx="56.5" cy="40.5" r="2" fill="#fff"/>
        <!-- Breites Grinsen -->
        <path d="M28,56 Q45,70 62,56" stroke="#c47a50" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="27" cy="54" r="6" fill="#ffb0a0" opacity=".4"/>
        <circle cx="63" cy="54" r="6" fill="#ffb0a0" opacity=".4"/>
      </svg>
      <span class="sp-av-name">Maxi</span>
    </div>

    <!-- Leah -->
    <div class="sp-av" id="sp-av-3">
      <svg viewBox="0 0 90 110" width="72" height="88">
        <!-- Körper / lila/farbiges Oberteil -->
        <path d="M12,72 L7,108 L83,108 L78,72 Q64,81 45,81 Q26,81 12,72Z" fill="#7b2d8b"/>
        <!-- Hals -->
        <rect x="38" y="61" width="14" height="13" fill="#f0b48a"/>
        <!-- Kopf -->
        <ellipse cx="45" cy="42" rx="25" ry="24" fill="#f0b48a"/>
        <!-- Langes glattes dunkles Haar -->
        <rect x="16" y="24" width="12" height="68" rx="6" fill="#150808"/>
        <rect x="62" y="24" width="12" height="68" rx="6" fill="#150808"/>
        <path d="M19,38 Q20,14 45,13 Q70,14 71,38 Q64,21 45,21 Q26,21 19,38" fill="#150808"/>
        <!-- Sonnenbrille auf dem Kopf -->
        <rect x="22" y="17" width="18" height="9" rx="4" fill="#1a1a1a" opacity=".85"/>
        <rect x="50" y="17" width="18" height="9" rx="4" fill="#1a1a1a" opacity=".85"/>
        <rect x="39" y="20" width="12" height="3" fill="#333"/>
        <!-- Augen -->
        <ellipse cx="35" cy="40" rx="4.5" ry="3.5" fill="#150800"/>
        <ellipse cx="55" cy="40" rx="4.5" ry="3.5" fill="#150800"/>
        <ellipse cx="36.5" cy="38.5" rx="1.8" ry="1.2" fill="#fff"/>
        <ellipse cx="56.5" cy="38.5" rx="1.8" ry="1.2" fill="#fff"/>
        <!-- Lächeln -->
        <path d="M31,52 Q45,63 59,52" stroke="#c47a50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="51" r="5" fill="#ffb0a0" opacity=".35"/>
        <circle cx="60" cy="51" r="5" fill="#ffb0a0" opacity=".35"/>
      </svg>
      <span class="sp-av-name">Leah</span>
    </div>
  </div>
</div>
```

- [ ] **Schritt 3: `initSplash()` und `endSplash()` in den `<script>`-Block einfügen**

```javascript
/* ══ SPLASH ══ */
function endSplash() {
  const splash = document.getElementById('splash');
  splash.classList.add('out');
  setTimeout(() => {
    splash.style.display = 'none';
    document.getElementById('app').classList.add('vis');
    initApp(); // wird in Task 4 definiert
  }, 900);
}

(function initSplash() {
  const delays = [400, 950, 1500, 2050];
  delays.forEach((d, i) => {
    setTimeout(() => {
      const el = document.getElementById('sp-av-' + i);
      if (el) el.classList.add('show');
    }, d);
  });
  setTimeout(endSplash, 10000);
})();
```

- [ ] **Schritt 4: Visuell prüfen**

`deploy/index.html` öffnen. Erwartung:
- Mittelmeer-Panorama mit animierter Sonne und Wellen sichtbar
- Segelboot erscheint nach ~3 Sekunden
- Vier Portraits erscheinen gestaffelt (Michael, Nina, Maxi, Leah)
- Michael: blaue Sonnenbrille, kurzes Haar
- Nina: rote eckige Brille, schwarzes Haar
- Maxi: lockiges dunkles Haar, breites Lächeln
- Leah: langes glattes dunkles Haar, Sonnenbrille auf dem Kopf
- Nach 10 Sekunden: Splash faded aus (konsole zeigt Fehler bei `initApp()` — normal, kommt in Task 4)
- Skip-Button oben rechts funktioniert

---

### Task 4: Header + Phase Hero

**Files:**
- Modify: `deploy/index.html` — CSS + JS für Header, Phase Hero, `initApp()`

**Interfaces:**
- Consumes: `getPhase()`, `IS_PREVIEW`, `DAYS`, `TRIP_START`
- Produces: `initApp()` Funktion, `renderHeader()`, `renderPhaseHero()`

- [ ] **Schritt 1: Header + Phase Hero CSS einfügen**

```css
/* ══ HEADER ══ */
#app-hdr {
  background: linear-gradient(135deg, var(--sea-deep) 0%, #0d2a50 100%);
  padding: 11px 16px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 20px rgba(10,40,80,.3);
}
.hdr-logo {
  font-family: 'Playfair Display', serif;
  color: #fff; font-size: clamp(.9rem, 2.2vw, 1.25rem); font-weight: 700;
}
.hdr-logo span { color: var(--lemon); }
.hdr-avs { display: flex; gap: 4px; align-items: center; }
.hdr-av  { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,255,255,.3); }
.hdr-btns { display: flex; gap: 6px; }
.hbtn {
  background: rgba(255,255,255,.13); color: #fff;
  border: 1.5px solid rgba(255,255,255,.28); border-radius: 9px;
  padding: 6px 11px; font-size: .72rem; font-weight: 800;
  display: flex; align-items: center; gap: 4px;
  transition: all .18s;
}
.hbtn:hover { background: rgba(255,255,255,.24); transform: translateY(-1px); }

/* ══ PHASE HERO ══ */
#phase-hero {
  width: 100%; overflow: hidden;
  position: relative; min-height: 300px;
}

/* Pre-Trip Hero */
.hero-pre {
  background: linear-gradient(170deg, var(--sand) 0%, #dceeff 50%, var(--sea3) 100%);
  padding: 40px 20px 50px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  position: relative; overflow: hidden;
}
.hero-pre-sun {
  position: absolute; top: -20px; right: -20px;
  width: 160px; height: 160px; border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #fff9c4, #ffe566 40%, rgba(255,180,0,0) 100%);
  opacity: .6;
}
.hero-pre-wave {
  position: absolute; bottom: -10px; left: -5%; right: -5%;
  height: 40px; background: var(--chalk); border-radius: 50%;
}
.hero-pre-label {
  font-size: .62rem; letter-spacing: 3px; text-transform: uppercase;
  color: var(--sea); font-weight: 800; margin-bottom: 10px;
}
.hero-pre-num {
  font-family: 'Playfair Display', serif;
  font-size: clamp(4rem, 14vw, 8rem); font-weight: 900;
  color: var(--dark); line-height: 1; letter-spacing: -4px;
  animation: numPulse 3s ease-in-out infinite;
}
@keyframes numPulse {
  50% { transform: scale(1.02); }
}
.hero-pre-unit {
  font-size: clamp(.85rem, 2.5vw, 1.1rem); font-weight: 800;
  color: var(--muted); letter-spacing: 2px; text-transform: uppercase;
  margin-top: 6px;
}
.hero-pre-next {
  margin-top: 22px; padding: 12px 20px;
  background: rgba(255,255,255,.7); border-radius: var(--r);
  backdrop-filter: blur(8px); border: 1.5px solid rgba(255,255,255,.9);
}
.hero-pre-next-label { font-size: .58rem; letter-spacing: 2px; text-transform: uppercase; color: var(--terra); font-weight: 800; margin-bottom: 4px; }
.hero-pre-next-title { font-size: .95rem; font-weight: 800; color: var(--dark); }

/* Trip Hero */
.hero-trip {
  position: relative; overflow: hidden; min-height: 320px;
  display: flex; align-items: flex-end; padding: 24px 20px;
}
.hero-trip-scene { position: absolute; inset: 0; }
.hero-trip-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(10,30,60,.88) 0%, rgba(10,30,60,.15) 55%, transparent 100%);
}
.hero-trip-content { position: relative; z-index: 2; width: 100%; }
.hero-trip-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--lemon); color: var(--dark);
  font-size: .6rem; font-weight: 900; letter-spacing: 1.5px;
  text-transform: uppercase; border-radius: 20px; padding: 4px 11px;
  margin-bottom: 10px;
}
.hero-trip-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.4rem, 5vw, 2.5rem); font-weight: 900;
  color: #fff; line-height: 1.1; margin-bottom: 8px;
}
.hero-trip-sub { font-size: .82rem; color: rgba(255,255,255,.7); font-weight: 600; }

/* Post Hero */
.hero-post {
  background: linear-gradient(135deg, var(--sea-deep), var(--dark));
  padding: 40px 20px; text-align: center; color: #fff;
}
.hero-post h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.4rem,4vw,2.2rem); font-weight: 900; margin-bottom: 8px;
}
.hero-post p { color: rgba(255,255,255,.65); font-size: .9rem; }

/* Scene: Strand (Agios Gordios + Ýpsos default) */
.scene-beach {
  background: linear-gradient(180deg, #c4e8ff 0%, #5bb8f5 45%, #1a7abf 70%, #0a3d6b 100%);
}
/* Scene: Ksamil (türkis) */
.scene-ksamil {
  background: linear-gradient(180deg, #d4f8f5 0%, #4dd8cc 40%, #1aaba0 65%, #0a5550 100%);
}
/* Scene: Korfu-Stadt (Sonnenuntergang) */
.scene-city {
  background: linear-gradient(180deg, #f5c890 0%, #e8885a 40%, #c4622d 65%, #5a2010 100%);
}
/* Scene: Anreise/Rückreise */
.scene-travel {
  background: linear-gradient(180deg, #d0ddf0 0%, #8aaad0 50%, #4a6a9a 100%);
}
```

- [ ] **Schritt 2: `renderHeader()` und `renderPhaseHero()` im Script-Block definieren**

```javascript
/* ══ HEADER ══ */
function renderHeader() {
  const MINI_AVATARS = [
    // Verkleinerte Kopf-SVGs (nur Kreis + Merkmal)
    `<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#f0b48a"/><rect x="4" y="9" width="9" height="5" rx="2.5" fill="#1a5fa8" opacity=".9"/><rect x="15" y="9" width="9" height="5" rx="2.5" fill="#1a5fa8" opacity=".9"/></svg>`,
    `<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#f0b48a"/><rect x="4" y="9" width="8" height="6" rx="2" fill="none" stroke="#cc1a1a" stroke-width="1.8"/><rect x="16" y="9" width="8" height="6" rx="2" fill="none" stroke="#cc1a1a" stroke-width="1.8"/></svg>`,
    `<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#f0b48a"/><circle cx="7" cy="11" r="4" fill="#100808"/><circle cx="21" cy="11" r="4" fill="#100808"/><circle cx="14" cy="7" r="4" fill="#100808"/></svg>`,
    `<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#f0b48a"/><rect x="4" y="5" width="7" height="4" rx="2" fill="#1a1a1a" opacity=".85"/><rect x="17" y="5" width="7" height="4" rx="2" fill="#1a1a1a" opacity=".85"/></svg>`,
  ];
  document.getElementById('app-hdr').innerHTML = `
    <div class="hdr-logo">🌊 Korfu &amp; <span>Ksamil</span></div>
    <div class="hdr-avs">
      ${MINI_AVATARS.map(s => `<div class="hdr-av">${s}</div>`).join('')}
    </div>
    <div class="hdr-btns">
      <button class="hbtn" onclick="openModal('route')">🗺 Route</button>
      <button class="hbtn" onclick="openModal('todo')">✅ Liste</button>
    </div>
  `;
}

/* ══ PHASE HERO ══ */
function getDaysUntilTrip() {
  const now = new Date();
  const diff = TRIP_START - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Nimmt das volle Day-Objekt um Sonderszenen (Korfu-Stadt) zu erkennen
function getDayScene(d) {
  if (d.et === 'tv')  return 'scene-travel';
  if (d.et === 'e2')  return 'scene-ksamil';
  // Korfu-Stadt Tage erkennen
  if (d.id === 'T4' || d.id === 'T6' || d.id === 'T15') return 'scene-city';
  return 'scene-beach';
}

function renderPhaseHero() {
  const phase = getPhase();
  const hero = document.getElementById('phase-hero');

  if (phase === 'pre') {
    const days = getDaysUntilTrip();
    hero.innerHTML = `
      <div class="hero-pre">
        <div class="hero-pre-sun"></div>
        <div class="hero-pre-label">Noch</div>
        <div class="hero-pre-num">${days}</div>
        <div class="hero-pre-unit">Tage bis Korfu</div>
        <div class="hero-pre-next">
          <div class="hero-pre-next-label">Erste Station</div>
          <div class="hero-pre-next-title">🏖 Agios Gordios · Poseidon Suites · ab 18. Juli</div>
        </div>
        <div class="hero-pre-wave"></div>
      </div>`;
    return;
  }

  if (phase === 'post') {
    hero.innerHTML = `
      <div class="hero-post">
        <h2>17 unvergessliche Tage 🌊</h2>
        <p>Korfu &amp; Ksamil · Sommer 2026 · Familie Monschein</p>
      </div>`;
    return;
  }

  // 'trip' oder 'preview' → heutigen Tag oder ersten Tag zeigen
  const todayIdx = getTodayIndex();
  const d = DAYS[todayIdx >= 0 ? todayIdx : 0];
  const sceneClass = getDayScene(d);
  const isToday = phase === 'trip';

  hero.innerHTML = `
    <div class="hero-trip">
      <div class="hero-trip-scene ${sceneClass}"></div>
      <div class="hero-trip-overlay"></div>
      <div class="hero-trip-content">
        ${isToday ? '<div class="hero-trip-badge">✨ Heute</div>' : ''}
        <div class="hero-trip-title">${d.title}</div>
        <div class="hero-trip-sub">${d.date} · ${d.wd} · ${d.sub}</div>
      </div>
    </div>`;
}
```

- [ ] **Schritt 3: `initApp()` definieren**

```javascript
/* ══ APP INIT ══ */
function initApp() {
  renderHeader();
  renderPhaseHero();
  buildTimeline();   // Task 5
  renderContent('ALL'); // Task 6
  initMap();         // Task 7
  buildModals();     // Task 8
}
```

- [ ] **Schritt 4: Visuell prüfen**

`deploy/index.html` nach Splash-Ende prüfen:
- Header: Logo + 4 Mini-Avatare + Route/Checklist-Buttons
- Phase Hero: Großer Countdown mit animierter Zahl (da Reise noch nicht begonnen)
- Konsolencheck bei `?preview`: Hero zeigt ersten Urlaubstag statt Countdown

---

### Task 5: Timeline Navigator

**Files:**
- Modify: `deploy/index.html` — CSS + `buildTimeline()`, `switchTab()`

**Interfaces:**
- Consumes: `DAYS`, `ETAPPES`, `getDayState()`
- Produces: `buildTimeline()`, `switchTab(id)`, `activeTab` Variable

- [ ] **Schritt 1: Timeline CSS einfügen**

```css
/* ══ TIMELINE ══ */
#timeline-wrap {
  background: #fff;
  border-bottom: 2px solid var(--sand2);
  position: sticky; top: 49px; z-index: 99;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}
.tl-etappes {
  display: flex; background: var(--sand);
  overflow-x: auto; scrollbar-width: none;
  padding: 2px 8px 0;
}
.tl-etappes::-webkit-scrollbar { display: none; }
.tl-etag {
  font-size: .56rem; font-weight: 900; text-transform: uppercase;
  letter-spacing: .8px; padding: 3px 10px; white-space: nowrap; color: var(--muted);
}
.tl-etag.e1 { color: var(--e1); }
.tl-etag.e2 { color: var(--e2); }
.tl-etag.e3 { color: var(--e3); }

.tl-scroll {
  overflow-x: auto; white-space: nowrap;
  scrollbar-width: none; touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
}
.tl-scroll::-webkit-scrollbar { display: none; }
.tl-inner { display: inline-flex; gap: 3px; padding: 5px 8px; }

/* Tab-Basis */
.tbtn {
  border: 2px solid transparent; border-radius: 9px;
  padding: 5px 10px; font-size: .72rem; font-weight: 700;
  white-space: nowrap; color: var(--muted); transition: all .18s;
  position: relative;
}
.tbtn:hover { background: var(--sand); }

/* State: locked */
.tbtn.locked { color: #ccc; }
.tbtn.locked::after { content: '🔒'; font-size: .55rem; position: absolute; top: -4px; right: -4px; }

/* State: past */
.tbtn.past { color: var(--olive); }
.tbtn.past::after { content: '✓'; font-size: .6rem; font-weight: 900; color: var(--olive); position: absolute; top: -5px; right: -4px; }

/* State: today */
.tbtn.today-state {
  animation: todayGlow 2.5s ease-in-out infinite;
}
@keyframes todayGlow {
  0%,100% { box-shadow: 0 0 0 0 rgba(26,122,191,0); }
  50%      { box-shadow: 0 0 0 4px rgba(26,122,191,.3); }
}

/* Active (selected) */
.tbtn.all.active  { background: var(--dark); border-color: var(--dark); color: #fff; }
.tbtn.e1.active   { background: var(--e1);   border-color: var(--e1);   color: #fff; }
.tbtn.e2.active   { background: var(--e2);   border-color: var(--e2);   color: #fff; }
.tbtn.e3.active   { background: var(--e3);   border-color: var(--e3);   color: #fff; }
.tbtn.tv.active   { background: var(--tv);   border-color: var(--tv);   color: #fff; }
```

- [ ] **Schritt 2: `buildTimeline()` und `switchTab()` im Script-Block**

```javascript
/* ══ TIMELINE ══ */
const ETAPPES = [
  { label:'🔵 Etappe 1 · Agios Gordios', cls:'e1', ids:['T1','T2','T3','T4','T5','T6','T7','T8'] },
  { label:'🔴 Etappe 2 · Ksamil',        cls:'e2', ids:['T9','T10','T11','T12'] },
  { label:'🟢 Etappe 3 · Ýpsos',         cls:'e3', ids:['T13','T14','T15','T16','T17'] },
];

let activeTab = 'ALL';

function buildTimeline() {
  const inner  = document.getElementById('tl-inner')  || createTimelineDOM();
  const etBar  = document.getElementById('tl-etappes') || document.querySelector('.tl-etappes');

  // ALLE-Button
  const allBtn = makeTabBtn('ALL', 'ALLE', 'all');
  allBtn.classList.add('active');
  inner.appendChild(allBtn);

  ETAPPES.forEach((e, ei) => {
    const etEl = document.createElement('span');
    etEl.className = `tl-etag ${e.cls}`;
    etEl.textContent = e.label;
    etBar.appendChild(etEl);

    e.ids.forEach((tid, ti) => {
      const d   = DAYS.find(x => x.id === tid);
      const idx = DAYS.indexOf(d);
      const state = getDayState(idx);
      const btn = makeTabBtn(tid, `${d.wd} ${d.date}`, d.et);
      if (state === 'past')   btn.classList.add('past');
      if (state === 'today')  btn.classList.add('today-state');
      if (state === 'locked') btn.classList.add('locked');
      inner.appendChild(btn);
    });
  });

  // Auto-scroll zu heute
  const todayIdx = getTodayIndex();
  if (todayIdx >= 0) {
    const todayId = DAYS[todayIdx].id;
    const phase = getPhase();
    if (phase === 'trip') {
      setTimeout(() => switchTab(todayId), 200);
    }
  }
}

function createTimelineDOM() {
  const wrap = document.getElementById('timeline-wrap');
  wrap.innerHTML = `
    <div class="tl-etappes" id="tl-etappes"></div>
    <div class="tl-scroll"><div class="tl-inner" id="tl-inner"></div></div>`;
  return document.getElementById('tl-inner');
}

function makeTabBtn(id, label, cls) {
  const b = document.createElement('button');
  b.className = `tbtn ${cls}`;
  b.dataset.id = id;
  b.textContent = label;
  b.onclick = () => switchTab(id);
  return b;
}

function switchTab(id) {
  activeTab = id;
  document.querySelectorAll('.tbtn').forEach(b => {
    b.classList.toggle('active', b.dataset.id === id);
  });
  renderContent(id);
  updateMap(id);

  // Aktiven Tab in Sicht scrollen
  const btn = document.querySelector(`.tbtn[data-id="${id}"]`);
  if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}
```

- [ ] **Schritt 3: Visuell prüfen**

Browser-Reload. Erwartung:
- Timeline unter dem Hero: „ALLE" + alle 17 Tage, nach Etappen gruppiert
- Heute (in pre-Trip Phase): alle Tage zeigen 🔒-Badge
- Tab-Klick: activer Tab hervorgehoben
- Horizontales Scrollen der Tab-Leiste auf Mobil-Viewport (DevTools → iPhone SE)

---

### Task 6: Day Experience Cards

**Files:**
- Modify: `deploy/index.html` — CSS + `renderContent()`, `renderDay()`, `weatherBox()`, Freischalt-Animation

**Interfaces:**
- Consumes: `DAYS`, `IMG`, `getDayState()`, `activeTab`
- Produces: `renderContent(id)`, `renderDay(d, idx)`, `weatherBox()`

- [ ] **Schritt 1: Card CSS einfügen**

```css
/* ══ MAIN LAYOUT ══ */
.main-lay { display: grid; grid-template-columns: 1fr 400px; min-height: calc(100vh - 150px); }
.map-panel { position: sticky; top: 150px; height: calc(100vh - 150px); }
#map { width: 100%; height: 100%; }
.content { padding: 18px; overflow-y: auto; max-height: calc(100vh - 150px); }
.content::-webkit-scrollbar { width: 4px; }
.content::-webkit-scrollbar-thumb { background: var(--sand2); border-radius: 2px; }

/* ══ DAY CARD ══ */
.dcard {
  background: #fff; border-radius: var(--r2);
  box-shadow: var(--sh2); margin-bottom: 22px; overflow: hidden;
  opacity: 0; transform: translateY(20px);
  transition: opacity .45s var(--ease-spring), transform .45s var(--ease-spring);
}
.dcard.vis { opacity: 1; transform: translateY(0); }

/* Karten-Hero */
.dcard-hero {
  height: 160px; position: relative; overflow: hidden;
  display: flex; align-items: flex-end; padding: 16px 20px;
}
.dcard-hero-scene { position: absolute; inset: 0; }
.dcard-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(10,30,60,.82) 0%, rgba(10,30,60,.1) 60%, transparent 100%);
}
.dcard-hero-content { position: relative; z-index: 2; }
.dtag {
  font-family: 'Space Mono', monospace;
  font-size: .62rem; color: rgba(255,255,255,.75); margin-bottom: 5px;
  display: flex; align-items: center; gap: 8px;
}
.detag {
  font-size: .55rem; padding: 2px 8px; border-radius: 10px;
  background: rgba(255,255,255,.18); color: #fff; font-weight: 700;
  letter-spacing: .5px; text-transform: uppercase;
}
.dcard-hero h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem; font-weight: 900; color: #fff; line-height: 1.15;
}
.dcard-hero p { font-size: .75rem; color: rgba(255,255,255,.65); margin-top: 3px; }

/* Scene-Farben für Karten (gleiche Klassen wie Hero) */
.scene-beach  { background: linear-gradient(160deg, #c4e8ff 0%, #5bb8f5 45%, #1a7abf 75%, #0a3d6b 100%); }
.scene-ksamil { background: linear-gradient(160deg, #d4f8f5 0%, #4dd8cc 45%, #1aaba0 70%, #0a5550 100%); }
.scene-city   { background: linear-gradient(160deg, #f5c890 0%, #e8885a 45%, #c4622d 70%, #5a2010 100%); }
.scene-travel { background: linear-gradient(160deg, #d0ddf0 0%, #8aaad0 55%, #4a6a9a 100%); }

/* Karten-Body */
.dbody { padding: 16px 20px; }

/* Freischalt-Animation */
.unlock-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--lemon); color: var(--dark);
  font-size: .58rem; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;
  border-radius: 20px; padding: 3px 10px; margin-bottom: 8px;
  animation: unlockPop .6s var(--ease-spring);
}
@keyframes unlockPop {
  from { transform: scale(.5); opacity: 0; }
  to   { transform: scale(1);  opacity: 1; }
}

/* Aktivitätenliste */
.alist { display: flex; flex-direction: column; gap: 9px; margin-bottom: 16px; }
.aitem { display: flex; gap: 10px; align-items: flex-start; }
.aico  { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
.atxt strong { display: block; font-size: .88rem; font-weight: 800; color: var(--dark); }
.atxt span   { font-size: .78rem; color: var(--muted); }

/* Selfie-Spots */
.sbox {
  background: linear-gradient(135deg, #fffbe6, #fff5cc);
  border-radius: 10px; padding: 11px 14px; margin-bottom: 13px;
  border-left: 3px solid var(--lemon2);
}
.sbox h4 { font-size: .68rem; font-weight: 900; color: #7a6000; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 7px; }
.sitem   { font-size: .78rem; color: #5a4500; margin-bottom: 4px; }

/* Abendprogramm */
.ebox {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 10px; padding: 11px 14px;
  border-left: 3px solid var(--sea); margin-bottom: 13px;
}
.ebox h4 { font-size: .68rem; font-weight: 900; color: var(--sea); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 5px; }
.ebox p  { font-size: .82rem; color: var(--dark); }

/* Fotos */
.photos-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 14px; }
.photo-wrap  { border-radius: 9px; overflow: hidden; aspect-ratio: 4/3; background: var(--sand); position: relative; }
.photo-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s; }
.photo-wrap:hover img { transform: scale(1.07); }
.photo-cap  { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,.55)); color: #fff; font-size: .62rem; padding: 8px 7px 5px; font-weight: 700; }

/* Restaurants */
.slabel { font-size: .65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted2); margin: 14px 0 8px; display: flex; align-items: center; gap: 8px; }
.slabel::after { content: ''; flex: 1; height: 1px; background: var(--sand2); }
.rcard { background: linear-gradient(135deg,#fff5ef,#fff0e8); border-radius: 9px; padding: 11px 14px; margin-bottom: 8px; border-left: 3px solid var(--terra); }
.rcard h4 { font-size: .88rem; font-weight: 800; color: var(--terra); }
.rcard p  { font-size: .78rem; color: var(--muted); margin-top: 4px; }
.rtags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 6px; }
.rtag  { background: rgba(196,98,45,.1); color: var(--terra); border-radius: 5px; padding: 2px 7px; font-size: .65rem; font-weight: 800; }

/* Tipps */
.tips-box { background: #f0fff4; border-radius: 9px; padding: 11px 14px; margin-top: 13px; border-left: 3px solid var(--olive); }
.tips-box h4 { font-size: .68rem; font-weight: 900; color: var(--olive); text-transform: uppercase; margin-bottom: 7px; }
.tip-item { font-size: .78rem; color: #2d5016; margin-bottom: 4px; padding-left: 13px; position: relative; }
.tip-item::before { content: '→'; position: absolute; left: 0; color: var(--olive); }

/* Alerts */
.alert-box { border-radius: 9px; padding: 11px 14px; margin-bottom: 13px; font-size: .8rem; }
.alert-box.warn { background: #fff3e0; border-left: 3px solid var(--terra); color: #5a3000; }
.alert-box.info { background: #e8f4ff; border-left: 3px solid var(--sea2); color: #003a5a; }
.alert-box strong { display: block; font-weight: 800; margin-bottom: 4px; }

/* Wetter-Box */
.weather-wrap {
  background: linear-gradient(135deg, #fff8e1, #ffe082);
  border-radius: var(--r); padding: 14px 18px; margin-bottom: 20px;
  border: 2px solid var(--lemon2);
  display: flex; gap: 13px; align-items: flex-start;
}
.weather-ico { font-size: 2rem; flex-shrink: 0; }
.weather-txt h3 { font-size: .88rem; font-weight: 900; color: #6b4000; margin-bottom: 7px; }
.weather-txt li { font-size: .78rem; color: #5a3500; padding-left: 13px; position: relative; list-style: none; margin-bottom: 3px; }
.weather-txt li::before { content: '☀️'; position: absolute; left: 0; font-size: .55rem; top: 3px; }

/* Fähren-Box */
.ferry-box { background: linear-gradient(135deg,#e0f2fe,#bae6fd); border-radius: 9px; padding: 11px 14px; margin-bottom: 13px; border-left: 3px solid var(--sea2); }
.ferry-box h4 { font-size: .8rem; font-weight: 900; color: #0369a1; margin-bottom: 5px; }
.ferry-box p  { font-size: .78rem; color: #0c4a6e; }
```

- [ ] **Schritt 2: `renderContent()` und `renderDay()` im Script-Block**

```javascript
/* ══ CONTENT RENDERING ══ */
const IMG_CAPS = {
  agiosGordios:'Agios Gordios Beach', korfuAerial:'Korfu-Stadt Panorama',
  alteFestung:'Alte Festung & Altstadt', paleokastritsa:'Paleokastritsa Panorama',
  paleokastritsa2:'Paleokastritsa Bucht', achilleion:'Achilleion Palast',
  pontikonisi:'Pontikonisi Mauseinsel', kanoni:'Kanoni Aussicht',
  oldFortress:'Alte Festung Korfu', ksamil:'Ksamil Beach',
  ksamilRiviera:'Ksamil Albanian Riviera', butrint:'Butrint UNESCO',
  blueEye:'Blaues Auge · Syri i Kaltër',
};

function imgTag(key, cap) {
  return `<div class="photo-wrap">
    <img src="${IMG[key]}" alt="${cap}" loading="lazy" onerror="this.parentElement.style.display='none'">
    <span class="photo-cap">${cap}</span>
  </div>`;
}

function weatherBox() {
  return `<div class="weather-wrap">
    <div class="weather-ico">☀️</div>
    <div class="weather-txt">
      <h3>Hitze-Alarm: Ende Juli / Anfang August!</h3>
      <ul>
        <li>32–38°C — Mittagssonne 13–16 Uhr meiden</li>
        <li>LSF 50+ für alle, alle 2h neu auftragen</li>
        <li>Mind. 2 Liter Wasser pro Person täglich</li>
        <li>Aktivitäten vor 12 Uhr oder nach 17 Uhr</li>
        <li>Leichte Kleidung, Hüte, Sonnenbrillen nicht vergessen</li>
      </ul>
    </div>
  </div>`;
}

function renderDay(d, idx) {
  const state     = getDayState(idx);
  const sceneClass = getDayScene(d);
  const etLabels  = { e1:'Etappe 1 · Agios Gordios', e2:'Etappe 2 · Ksamil', e3:'Etappe 3 · Ýpsos', tv:'Transfer' };
  const isToday   = state === 'today';
  const isLocked  = state === 'locked';

  let h = `<div class="dcard" id="dc-${d.id}">`;

  // Hero
  h += `<div class="dcard-hero">
    <div class="dcard-hero-scene ${sceneClass}"></div>
    <div class="dcard-hero-overlay"></div>
    <div class="dcard-hero-content">
      <div class="dtag">
        <span>${d.id} · ${d.date} · ${d.wd}</span>
        <span class="detag">${etLabels[d.et] || ''}</span>
      </div>
      <h2>${d.title}</h2>
      <p>${d.sub}</p>
    </div>
  </div>`;

  h += `<div class="dbody">`;

  // Freischalt-Badge bei heutigem Tag
  if (isToday) h += `<div class="unlock-badge">✨ Heute freigeschaltet</div>`;

  // Locked-Overlay
  if (isLocked) {
    h += `<div style="text-align:center;padding:24px 0;color:var(--muted2)">
      <div style="font-size:1.8rem;margin-bottom:8px">🔒</div>
      <div style="font-size:.82rem;font-weight:700">Verfügbar ab ${d.date}</div>
    </div>`;
    h += `</div></div>`;
    return h;
  }

  // Alerts
  d.alerts.forEach(a => h += `<div class="alert-box ${a.t}"><strong>${a.t==='warn'?'⚠️ Wichtig:':'ℹ️ Info:'}</strong>${a.text}</div>`);

  // Aktivitäten
  if (d.acts.length) {
    h += `<ul class="alist">`;
    d.acts.forEach(a => h += `<li class="aitem"><span class="aico">${a.i}</span><div class="atxt"><strong>${a.t}</strong><span>${a.d}</span></div></li>`);
    h += `</ul>`;
  }

  // Fotos
  if (d.photos.length) {
    h += `<div class="photos-grid">`;
    d.photos.forEach(p => h += imgTag(p, IMG_CAPS[p] || p));
    h += `</div>`;
  }

  // Selfie-Spots
  if (d.selfie.length) {
    h += `<div class="sbox"><h4>📸 Selfie & Foto-Spots</h4>`;
    d.selfie.forEach(s => h += `<div class="sitem">📍 <strong>${s.t}</strong> — ${s.tip}</div>`);
    h += `</div>`;
  }

  // Restaurants
  if (d.rests.length) {
    h += `<div class="slabel">🍴 Restaurants & Cafés</div>`;
    d.rests.forEach(r => h += `<div class="rcard"><h4>${r.n}</h4><p>${r.d}</p><div class="rtags">${r.tags.map(t=>`<span class="rtag">${t}</span>`).join('')}</div></div>`);
  }

  // Abend
  if (d.eve) h += `<div class="ebox"><h4>🌆 Abendprogramm</h4><p>${d.eve}</p></div>`;

  // Tipps
  if (d.tips.length) {
    h += `<div class="tips-box"><h4>💡 Tipps</h4>`;
    d.tips.forEach(t => h += `<div class="tip-item">${t}</div>`);
    h += `</div>`;
  }

  // Fähren-Box (automatisch für T9 und T13)
  if (d.id === 'T9') h += `<div class="ferry-box"><h4>⛴ Fähre Korfu → Saranda</h4><p>Ionian Seaways / Finikas Lines · ca. 45 Min · VORAB buchen! ca. 15–20 €/P</p></div>`;
  if (d.id === 'T13') h += `<div class="ferry-box"><h4>⛴ Fähre Saranda → Korfu</h4><p>Rückticket · gleiche Anbieter · ca. 45 Min</p></div>`;

  h += `</div></div>`;
  return h;
}

function renderContent(id) {
  const ct = document.getElementById('content');
  if (id === 'ALL') {
    let h = weatherBox();
    DAYS.forEach((d, idx) => h += renderDay(d, idx));
    ct.innerHTML = h;
  } else {
    const idx = DAYS.findIndex(x => x.id === id);
    ct.innerHTML = weatherBox() + renderDay(DAYS[idx], idx);
  }
  requestAnimationFrame(() => {
    document.querySelectorAll('.dcard').forEach((c, i) => {
      setTimeout(() => c.classList.add('vis'), i * 55);
    });
  });
  ct.scrollTop = 0;
}
```

- [ ] **Schritt 3: Visuell prüfen**

`deploy/index.html?preview` öffnen (Preview-Modus, alle Tage entsperrt):
- Alle 17 Karten erscheinen gestaffelt eingeblendet
- Jede Karte hat einen animierten Hero (beach/ksamil/city/travel je nach Etappe)
- Karte T9 und T13 zeigen die Fähren-Box
- Auf `deploy/index.html` (kein preview): alle Tage zeigen 🔒 + Datum
- Karten-Höhen, Fotos, Selfie-Spots, Restaurants alle korrekt

---

### Task 7: Karte (Leaflet + CartoDB)

**Files:**
- Modify: `deploy/index.html` — CSS Karte + `initMap()`, `updateMap()`, `makeIcon()`, `addRoute()`

**Interfaces:**
- Consumes: `LOCS`, `DAYS`, `ETAPPES`, `getDayState()`
- Produces: `initMap()`, `updateMap(id)`

- [ ] **Schritt 1: Karten-CSS einfügen**

```css
/* ══ RESPONSIVE ══ */
@media (max-width: 768px) {
  .main-lay { grid-template-columns: 1fr; grid-template-rows: 260px auto; }
  .map-panel { position: relative; top: auto; height: 260px; order: -1; }
  #map { height: 260px; }
  .content { max-height: none; overflow-y: visible; }
  .photos-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .map-panel { height: 210px; }
  #map { height: 210px; }
  .main-lay { grid-template-rows: 210px auto; }
}

/* Leaflet Popup */
.leaflet-popup-content strong { font-size: .85rem; font-family: 'Nunito', sans-serif; }
.leaflet-popup-content span   { font-size: .75rem; color: #666; }
.cmarker {
  border: 2.5px solid #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; font-weight: 800;
  box-shadow: 0 2px 10px rgba(0,0,0,.35);
}
```

- [ ] **Schritt 2: Karten-Funktionen im Script-Block**

```javascript
/* ══ MAP ══ */
let map, layerGroup;

function initMap() {
  map = L.map('map', { zoomControl: true, attributionControl: false });
  // CartoDB Positron: cleaner, besser zum Stil
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(map);
  L.control.attribution({ prefix: '© CartoDB · © OpenStreetMap' }).addTo(map);
  layerGroup = L.layerGroup().addTo(map);
  updateMap('ALL');
}

function makeIcon(type, label) {
  const colors = {
    e1:'#1a7abf', e2:'#c4622d', e3:'#5c7a3e', tv:'#4a5568',
    hotel:'#5c7a3e', selfie:'#ffe566', ferry:'#00b4b4'
  };
  const textColors = { selfie:'#5a4000' };
  const c  = colors[type]  || '#888';
  const tc = textColors[type] || '#fff';
  return L.divIcon({
    html: `<div class="cmarker" style="background:${c};color:${tc};width:30px;height:30px">${label}</div>`,
    className: '', iconSize: [30,30], iconAnchor: [15,15], popupAnchor: [0,-15]
  });
}

function addRoute(pts, color) {
  if (pts.length < 2) return;
  L.polyline(pts, { color, weight: 3, opacity: .65, dashArray: '6,4' }).addTo(layerGroup);
}

function etColor(et) {
  return { e1:'#1a7abf', e2:'#c4622d', e3:'#5c7a3e', tv:'#4a5568' }[et] || '#888';
}

function updateMap(id) {
  if (!map) return;
  layerGroup.clearLayers();

  if (id === 'ALL') {
    ['e1','e2','e3'].forEach(et => {
      const pts = [...new Set(
        DAYS.filter(d => d.et === et)
            .map(d => LOCS[d.marks[0]])
            .filter(Boolean)
            .map(l => JSON.stringify(l.ll))
      )].map(JSON.parse);
      addRoute(pts, etColor(et));
    });
    addRoute([LOCS.korfuPort.ll, LOCS.saranda.ll], '#00b4b4');

    Object.entries(LOCS).forEach(([k, loc]) => {
      const lbl = loc.type==='selfie'?'📸' : loc.type==='hotel'?'🏠' : loc.type==='ferry'?'⛴' : '●';
      L.marker(loc.ll, { icon: makeIcon(loc.type, lbl) })
       .addTo(layerGroup)
       .bindPopup(`<strong>${loc.name}</strong>`);
    });
    map.fitBounds([[39.45,19.60],[39.95,20.40]], { padding:[20,20] });
  } else {
    const d   = DAYS.find(x => x.id === id);
    const pts = d.marks.map(k => LOCS[k]).filter(Boolean);
    const lls = pts.map(l => l.ll);
    if (lls.length > 1) addRoute(lls, etColor(d.et));
    pts.forEach((loc, i) => {
      const lbl = loc.type==='selfie'?'📸' : loc.type==='hotel'?'🏠' : loc.type==='ferry'?'⛴' : `${i+1}`;
      L.marker(loc.ll, { icon: makeIcon(loc.type, lbl) })
       .addTo(layerGroup)
       .bindPopup(`<strong>${loc.name}</strong><br><span>${d.title}</span>`)
       .openPopup();
    });
    if (lls.length === 1) map.setView(lls[0], d.center[2] || 13);
    else if (lls.length > 1) map.fitBounds(lls, { padding:[40,40] });
    else map.setView([d.center[0], d.center[1]], d.center[2] || 12);
  }
}
```

- [ ] **Schritt 3: Visuell prüfen**

`deploy/index.html?preview` öffnen:
- Karte rechts (Desktop) / oben (Mobile) sichtbar
- CartoDB Positron Tiles (heller, sauberer als OpenStreetMap)
- ALLE-Ansicht: farbige Routen für alle 3 Etappen + türkise Fährlinie
- Tab-Wechsel → Karte springt auf den entsprechenden Bereich
- Mobile: Karte 260px hoch, über dem Content

---

### Task 8: Modals + Finale Zusammenführung

**Files:**
- Modify: `deploy/index.html` — Modal CSS + `buildModals()`, `openModal()`, `closeModal()`, Todo-Logik

**Interfaces:**
- Consumes: `TODOS`, `ROUTE_HTML`, localStorage `korfu26_todo`
- Produces: `openModal(id)`, `closeModal(id)`, `toggleTodo(id)`

- [ ] **Schritt 1: Modal CSS einfügen**

```css
/* ══ MODALS ══ */
.moverlay {
  position: fixed; inset: 0; background: rgba(10,20,40,.75);
  z-index: 1000; display: flex; align-items: flex-end; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity .3s;
  backdrop-filter: blur(4px);
}
.moverlay.open { opacity: 1; pointer-events: all; }
.msheet {
  background: var(--chalk); border-radius: 24px 24px 0 0;
  width: 100%; max-width: 720px; max-height: 88vh;
  overflow-y: auto; padding: 22px 20px 40px;
  transform: translateY(100%);
  transition: transform .4s var(--ease-spring);
}
.moverlay.open .msheet { transform: translateY(0); }
.mhandle { width: 40px; height: 4px; background: var(--sand2); border-radius: 2px; margin: 0 auto 20px; }
.mhdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.mhdr h2 { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--dark); }
.mclose { background: var(--sand2); border-radius: 50%; width: 32px; height: 32px; font-size: .95rem; display: flex; align-items: center; justify-content: center; transition: background .2s; }
.mclose:hover { background: #e0cca0; }

/* Route Modal */
.rseg { margin-bottom: 24px; }
.rseg h3 { font-family: 'Playfair Display', serif; font-size: .95rem; color: var(--sea); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid var(--sand2); }
.rstep { display: flex; gap: 11px; align-items: flex-start; margin-bottom: 11px; position: relative; }
.rstep:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 34px; bottom: -7px; width: 2px; background: var(--sand2); }
.rbullet { width: 32px; height: 32px; border-radius: 50%; background: var(--sea); color: #fff; display: flex; align-items: center; justify-content: center; font-size: .85rem; flex-shrink: 0; }
.rbullet.tv { background: var(--tv); }
.rbullet.e2 { background: var(--e2); }
.rbullet.e3 { background: var(--e3); }
.rcon strong { display: block; font-size: .88rem; font-weight: 700; }
.rcon span   { font-size: .77rem; color: var(--muted); }

/* Todo Modal */
.todo-prog { background: var(--sand2); border-radius: 5px; height: 6px; margin-bottom: 16px; overflow: hidden; }
.todo-bar  { background: linear-gradient(90deg, var(--olive), var(--sea2)); height: 100%; border-radius: 5px; transition: width .4s; }
.todo-stat { font-size: .78rem; color: var(--muted); margin-bottom: 8px; }
.tgroup    { margin-bottom: 20px; }
.tgroup-hdr { font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--muted2); margin-bottom: 9px; }
.titem { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; background: #fff; border-radius: 9px; margin-bottom: 6px; cursor: pointer; transition: all .18s; border: 2px solid transparent; }
.titem:hover     { border-color: var(--sand2); }
.titem.done      { background: #f0fff4; border-color: #a8e6b8; }
.titem.urgent .tlabel::after { content: ' ⚠️'; }
.titem input[type=checkbox] { width: 17px; height: 17px; accent-color: var(--olive); cursor: pointer; flex-shrink: 0; margin-top: 2px; }
.tlabel      { font-size: .83rem; font-weight: 700; }
.titem.done .tlabel { text-decoration: line-through; color: var(--muted); }
.tnote       { font-size: .72rem; color: var(--muted); margin-top: 2px; }
```

- [ ] **Schritt 2: Modal-Logik im Script-Block**

```javascript
/* ══ MODALS ══ */
function buildModals() {
  // Overlay-Click schließt Modal
  document.querySelectorAll('.moverlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) closeModal(m.id.replace('modal-',''));
    });
  });
}

function openModal(id) {
  if (id === 'route') document.getElementById('route-content').innerHTML = ROUTE_HTML;
  if (id === 'todo')  renderTodo();
  document.getElementById('modal-' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById('modal-' + id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ── TODO ── */
function getTodoState() {
  try { return JSON.parse(localStorage.getItem('korfu26_todo') || '{}'); } catch { return {}; }
}
function saveTodoState(s) { localStorage.setItem('korfu26_todo', JSON.stringify(s)); }

function renderTodo() {
  const state = getTodoState();
  const allIds = TODOS.flatMap(g => g.items.map(i => i.id));
  const done = allIds.filter(id => state[id]).length;
  const pct  = Math.round(done / allIds.length * 100);

  document.getElementById('todo-stat').textContent = `${done} von ${allIds.length} erledigt`;
  document.getElementById('todo-bar').style.width  = pct + '%';

  let h = '';
  TODOS.forEach(g => {
    h += `<div class="tgroup"><div class="tgroup-hdr">${g.g}</div>`;
    g.items.forEach(item => {
      const chk = !!state[item.id];
      h += `<div class="titem${chk?' done':''}${item.urgent?' urgent':''}" onclick="toggleTodo('${item.id}')">
        <input type="checkbox" id="cb_${item.id}" ${chk?'checked':''} onclick="event.stopPropagation()">
        <div><div class="tlabel">${item.label}</div>${item.note ? `<div class="tnote">${item.note}</div>` : ''}</div>
      </div>`;
    });
    h += `</div>`;
  });
  document.getElementById('todo-content').innerHTML = h;
}

function toggleTodo(id) {
  const s = getTodoState();
  s[id] = !s[id];
  saveTodoState(s);
  renderTodo();
}
```

- [ ] **Schritt 3: Finaler Integrationstest**

Checklist für vollständigen User-Journey auf `deploy/index.html`:

**Splash:**
- [ ] Mediterrane Szene animiert korrekt
- [ ] 4 Portraits erscheinen gestaffelt, sind erkennbar
- [ ] Auto-Skip nach 10s
- [ ] Skip-Button funktioniert

**App (normaler Modus):**
- [ ] Header: Logo + 4 Mini-Avatare + Buttons sichtbar
- [ ] Phase Hero: Countdown zeigt korrekte Tageszahl
- [ ] Timeline: alle Tage mit 🔒 (Pre-Trip Phase)
- [ ] Content: Wetter-Box + alle Karten (locked)
- [ ] Karte: CartoDB Tiles, alle Routen

**Preview-Modus** (`?preview`):
- [ ] Preview-Banner sichtbar
- [ ] Phase Hero: zeigt Tag 1 (nicht Countdown)
- [ ] Timeline: alle Tage entsperrt, kein 🔒
- [ ] Alle 17 Karten vollständig lesbar
- [ ] Fotos laden (onerror fallback funktioniert bei kaputten URLs)

**Modals:**
- [ ] Route-Button öffnet Route-Modal
- [ ] Checklist-Button öffnet Todo-Modal
- [ ] Checkboxen togglen, Fortschrittsbalken aktualisiert sich
- [ ] localStorage: State bleibt nach Page-Reload erhalten
- [ ] Overlay-Klick schließt Modal

**Mobile (DevTools iPhone SE 375px):**
- [ ] Karte 260px über Content
- [ ] Timeline horizontal scrollbar
- [ ] Karten-Hero lesbar
- [ ] Modals als Bottom-Sheet

- [ ] **Schritt 4: Deployment-Test**

```bash
cd "/Users/michaelmonschein/Documents/Claude/Holiday Projects/Korfu_Ksamil_July_2026"
npx wrangler pages deploy deploy --project-name=korfu-ksamil-2026
```

Erwartung: Deploy erfolgreich, URL erhalten, im echten Browser auf iOS Safari testen.
