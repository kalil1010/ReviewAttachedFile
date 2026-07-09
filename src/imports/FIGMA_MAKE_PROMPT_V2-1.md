# Figma Make — Revision Prompt (v4)
**Project:** FrameFinder — macOS Desktop App

Please apply the following changes to the existing FrameFinder design. Do not redesign from scratch — keep all existing screens, colors, and components intact and only apply the modifications listed below.

---

## Change 1: Add "Scenes" to the Sidebar Navigation

The current sidebar has these items:
```
Dashboard, Smart Search, People, Reviews, Settings
```

Add a new nav item **"Scenes"** between **"Smart Search"** and **"People"**:
```
Dashboard, Smart Search, Scenes, People, Reviews, Settings
```

- **Icon:** use `LayoutGrid` (or `Grid2x2`) from Lucide icons
- **No badge** on this item
- The item follows the exact same style as the existing nav items (same padding, font size, hover/active states)

---

## Change 2: Build the New "Scenes" Screen

This is a new screen accessible from the sidebar. It acts as a **visual library of all indexed scene categories** discovered across all drives, with **visual metadata filters**.

### Layout (top to bottom)
1. **Header** — title + subtitle
2. **Filter Bar** — three filter rows
3. **Scene Cards Grid** — scrollable

---

### 2A — Header
- Title: `"Scenes"`
- Subtitle: `"247 scenes across 3 drives"` (dynamic count, updates when filters active: `"142 matching scenes"`)

---

### 2B — Filter Bar

A horizontal filter bar below the header (above the grid). Contains **three filter groups** in a single row, separated by a subtle `1px solid #38383A` divider on the right of each group.

**Filter bar container:**
```
background:  #2C2C2E
border-bottom: 1px solid #38383A
padding: 10px 24px
display: flex
gap: 24px
align-items: center
```

#### Filter Group 1: Lighting
Label: `"Lighting"` (12px muted, above the chips)

Chips (select one or none):
```
[ All ]  [ ☀️ Natural ]  [ 🌅 Golden Hour ]  [ ☁️ Overcast ]  [ 👎 Studio ]  [ 🌑 Low Light ]  [ ⬛ Backlit ]
```

#### Filter Group 2: Time of Day
Label: `"Time of Day"`

Chips:
```
[ All ]  [ ☀️ Day ]  [ 🌅 Golden Hour ]  [ 🌆 Blue Hour ]  [ 🌙 Night ]
```

#### Filter Group 3: Shooting Type
Label: `"Shooting Type"`

Chips:
```
[ All ]  [ 🌍 Wide ]  [ 🔍 Close-Up ]  [ 🚁 Aerial ]  [ 🏠 Indoor ]  [ 🌳 Outdoor ]  [ 🎬 Slow-Mo ]
```

**Chip style — inactive:**
```
background:    rgba(235,235,245,0.06)
border:        1px solid #38383A
border-radius: 20px
padding:       4px 12px
font-size:     12px
color:         rgba(235,235,245,0.6)
```

**Chip style — active (selected):**
```
background:    rgba(10,132,255,0.15)
border:        1px solid #0A84FF
color:         #0A84FF
font-weight:   600
```

**"Clear filters" link** — appears only when any filter is active, right-aligned in the filter bar:
```
text: "Clear filters"
color: rgba(235,235,245,0.4)
font-size: 12px
hover color: #0A84FF
```

**Behavior:** Filters are combinable (AND logic). Selecting `Golden Hour` + `Wide` shows only cards where both conditions match. Cards with 0 results are hidden.

---

### 2C — Scene Category Cards Grid
Display a **grid of Scene Category Cards** (`repeat(auto-fill, minmax(200px, 1fr))`).

Each card represents a **scene type** and contains:

1. **Cover image** — a representative keyframe thumbnail (use Unsplash images as placeholders)
2. **Scene label** — bold, e.g. `"Outdoor"`, `"Concert"`, `"Wedding"`
3. **Count badge** — e.g. `"142 scenes"` in small muted text below the label
4. **Drive indicator** — small row of colored dots (one per drive), tooltip on hover showing drive names
5. **Visual metadata chips** — tiny chips at the bottom of the card body showing the dominant filters for that scene:
   ```
   e.g.  [ Natural ] [ Day ] [ Wide ]
   ```
   Chip style: `background: rgba(235,235,245,0.06)`, `font-size: 10px`, `border-radius: 4px`, `padding: 2px 6px`

**Card style:**
```
background:     #2C2C2E
border:         1px solid #38383A
border-radius:  12px
overflow:       hidden
hover border:   1px solid #0A84FF
```

**Cover image:**
```
width:   100%
height:  120px
object-fit: cover
```

**Card body padding:** `12px`

---

### Seed Data (use this exact data for the prototype)
```
{ label: "Outdoor",    count: 312, lighting: "natural",     time: "day",         shooting: "wide",     image: Unsplash nature/outdoor }
{ label: "Concert",    count: 87,  lighting: "low-light",   time: "night",       shooting: "wide",     image: Unsplash concert }
{ label: "Wedding",    count: 54,  lighting: "natural",     time: "golden-hour", shooting: "close-up", image: Unsplash wedding }
{ label: "Sports",     count: 201, lighting: "natural",     time: "day",         shooting: "wide",     image: Unsplash sports }
{ label: "Night",      count: 143, lighting: "low-light",   time: "night",       shooting: "outdoor",  image: Unsplash city-night }
{ label: "People",     count: 489, lighting: "natural",     time: "day",         shooting: "close-up", image: Unsplash crowd }
{ label: "Food",       count: 67,  lighting: "studio",      time: "day",         shooting: "close-up", image: Unsplash food }
{ label: "Travel",     count: 178, lighting: "natural",     time: "golden-hour", shooting: "wide",     image: Unsplash travel }
{ label: "Graduation", count: 23,  lighting: "natural",     time: "day",         shooting: "wide",     image: Unsplash graduation }
{ label: "Birthday",   count: 41,  lighting: "studio",      time: "day",         shooting: "indoor",   image: Unsplash party }
{ label: "Landscape",  count: 95,  lighting: "golden-hour", time: "golden-hour", shooting: "aerial",   image: Unsplash landscape }
{ label: "Unknown",    count: 38,  lighting: "low-light",   time: "night",       shooting: "wide",     image: gray #3A3A3C }
```

### Clicking a Scene Card
When the user clicks a Scene Card, navigate to the **Smart Search** screen with the scene label pre-filled in the search bar (e.g. clicking "Wedding" shows search results for "wedding").

---

## Change 3: Fix the People Screen — Edit Button Bug

In the current People screen, each Person Card has an edit icon (`Edit2`) but it never appears because the parent `<div>` is missing the `group` CSS class.

**Fix:** Add `group` class to the Person Card's outer `<div>` so the edit button becomes visible on hover:
```tsx
// Change this:
<div className="rounded-xl p-4 flex flex-col items-center gap-2.5" ...>

// To this:
<div className="group rounded-xl p-4 flex flex-col items-center gap-2.5" ...>
```

---

## Change 4: Fix QR Code Re-rendering

The current QR Code placeholder re-generates randomly on every render because it uses `Math.random()` inline.

**Fix:** Wrap the QR grid data in `useMemo` so it only generates once per drive:
```tsx
const qrCells = useMemo(
  () => Array.from({ length: 49 }).map(() => Math.random() > 0.5),
  [drive.id]
);
```
Then use `qrCells[i]` instead of `Math.random() > 0.5` in the render.

---

## Change 5: Fix Confidence Threshold Default Values

In the Settings screen, the `autoReject` default value is `40` but according to the PRD it should be `65` (Auto-Reject below 65%).

**Fix:**
```tsx
// Change this:
const [autoReject, setAutoReject] = useState(40);

// To this:
const [autoReject, setAutoReject] = useState(65);
```

Also add a **third slider** for the lower boundary of the Review Zone (currently only Auto-Confirm upper boundary is configurable). The three zones should be:
- Auto-Reject below `X%` (red slider)
- Manual Review between `X%` and `Y%` (orange zone — no slider needed, it's derived automatically)
- Auto-Confirm above `Y%` (green slider)

The visual band at the bottom of the Confidence Thresholds section already exists — make sure it correctly reflects all three zones based on both slider values.

---

---

## Change 6: Add Login Screen (Before Main App)

The app now requires users to authenticate before accessing any screen. Add a **Login screen** that appears before the main sidebar layout.

### Layout
- Full-window centered card — no sidebar, no window chrome content area
- macOS window chrome (traffic lights) still visible at the top
- Card dimensions: `400px wide`, vertically centered

### Card Contents (top to bottom)
1. **App icon + name** — the `Film` icon in a blue rounded square + `"FrameFinder"` text (same as sidebar branding)
2. **Title:** `"Sign in to FrameFinder"` — 18px semibold white
3. **Email field** — label `"Email"`, placeholder `"you@example.com"`
4. **Password field** — label `"Password"`, placeholder `"••••••••"`, eye toggle to show/hide
5. **Sign In button** — full width, `#0A84FF` background, white text `"Sign In"`
6. **Error state** — red inline message below the button: `"Invalid email or password"` (shown conditionally)
7. **Footer note** — small muted text: `"Don't have an account? Contact your administrator."`

**Card style:**
```
background:    #2C2C2E
border:        1px solid #38383A
border-radius: 16px
padding:       32px
```

**Background:** full window `#1C1C1E`

### States to show in prototype
- **Default** — empty fields
- **Error** — show error message below button
- **Loading** — button shows `"Signing in…"` with disabled state

---

## Change 7: Add "Add New Drive" Modal (Two-Step)

The existing "Add New Drive" button on the Dashboard has no action. Wire it to a **two-step Modal**.

### Step 1 — Select Drive
**Modal header:** `"Select a Drive to Register"`

Show a **list of detected external drives** (filtered — no system drives). Each row contains:
- HardDrive icon (blue if connected, gray if not)
- Drive name (e.g. `"WD Elements"`) + type badge (`"USB"` / `"Thunderbolt"`)
- Drive size (e.g. `"2.0 TB"`)
- Mount path in monospace (e.g. `"/Volumes/WD Elements"`)
- Radio button to select

**Empty state:** If no external drives detected, show:
```
icon: HardDrive (large, muted)
message: "No external drives detected"
subtext: "Connect a USB or Thunderbolt drive to continue"
```

**Footer buttons:** `[Cancel]` (ghost) + `[Next →]` (blue, disabled until a drive is selected)

### Step 2 — Name & Register
**Modal header:** `"Name this Drive"`

- **Drive Name field** — pre-filled with the detected volume name, editable
- **Path display** — read-only monospace row showing the mount path
- **Size display** — read-only row showing drive size

**Footer buttons:** `[← Back]` (ghost) + `[Register & Start Indexing]` (blue)

**Modal style (both steps):**
```
background:    #2C2C2E
border:        1px solid #38383A
border-radius: 16px
width:         480px
overlay:       rgba(0,0,0,0.6)
```

**Step indicator** at the top of the modal:
```
● Step 1 of 2   or   ● ● Step 2 of 2
```
(two small dots, active dot = #0A84FF, inactive = #3A3A3C)

---

## Summary of Changes

| # | What | Where |
|---|---|---|
| 1 | Add "Scenes" nav item | Sidebar |
| 2 | Build Scenes screen with Filter Bar (Lighting + Time of Day + Shooting Type) + Cards Grid | New screen |
| 3 | Fix `group` class on Person Card | People screen |
| 4 | Fix QR Code `useMemo` | Dashboard / QRModal |
| 5 | Fix `autoReject` default (40 → 65) + add lower slider | Settings screen |
| 6 | Add Login screen (pre-app authentication) | New screen |
| 7 | Add "Add New Drive" two-step Modal | Dashboard |

---

## Do NOT Change

- Color palette — keep all existing hex values exactly as-is
- Overall layout structure (sidebar + content area)
- macOS window chrome (traffic lights)
- All existing screens not mentioned above
- Keyboard shortcuts in Reviews screen
