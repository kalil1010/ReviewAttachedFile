# Figma Make — Revision Prompt (v2)
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

This is a new screen accessible from the sidebar. It acts as a **visual library of all indexed scene categories** discovered across all drives.

### Layout
- Same layout pattern as the existing screens: Header at top + scrollable content area below
- **Header:**
  - Title: `"Scenes"`
  - Subtitle: `"247 scenes across 3 drives"` (dynamic count)
  - No action buttons needed in the header

### Content: Scene Category Cards Grid
Display a **grid of Scene Category Cards** (`repeat(auto-fill, minmax(200px, 1fr))`).

Each card represents a **scene type** (e.g. Outdoor, People, Night, Concert, Wedding, Sports, Food, etc.) and contains:

1. **Cover image** — a representative keyframe thumbnail (use Unsplash images as placeholders)
2. **Scene label** — bold, e.g. `"Outdoor"`, `"Concert"`, `"Wedding"`
3. **Count badge** — e.g. `"142 scenes"` in small muted text below the label
4. **Drive indicator** — small row of colored dots (one per drive that contains this scene type), with a tooltip showing drive names on hover

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

### Seed Data (use this exact data for the prototype)
```
{ label: "Outdoor",   count: 312, image: Unsplash nature/outdoor photo }
{ label: "Concert",   count: 87,  image: Unsplash concert/music photo }
{ label: "Wedding",   count: 54,  image: Unsplash wedding photo }
{ label: "Sports",    count: 201, image: Unsplash sports photo }
{ label: "Night",     count: 143, image: Unsplash city-night photo }
{ label: "People",    count: 489, image: Unsplash crowd/people photo }
{ label: "Food",      count: 67,  image: Unsplash food photo }
{ label: "Travel",    count: 178, image: Unsplash travel photo }
{ label: "Graduation",count: 23,  image: Unsplash graduation photo }
{ label: "Birthday",  count: 41,  image: Unsplash party photo }
{ label: "Landscape", count: 95,  image: Unsplash landscape photo }
{ label: "Unknown",   count: 38,  image: gray placeholder #3A3A3C }
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

## Summary of Changes

| # | What | Where |
|---|---|---|
| 1 | Add "Scenes" nav item | Sidebar |
| 2 | Build Scenes screen with category cards grid | New screen |
| 3 | Fix `group` class on Person Card | People screen |
| 4 | Fix QR Code `useMemo` | Dashboard / QRModal |
| 5 | Fix `autoReject` default (40 → 65) + add lower slider | Settings screen |

---

## Do NOT Change

- Color palette — keep all existing hex values exactly as-is
- Overall layout structure (sidebar + content area)
- macOS window chrome (traffic lights)
- All existing screens not mentioned above
- Keyboard shortcuts in Reviews screen
