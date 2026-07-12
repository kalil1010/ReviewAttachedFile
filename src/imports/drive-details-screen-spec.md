# FrameFinder — Drive Details Screen (Figma Make Spec)

## Overview
صفحة تفصيلية لكل Hard Drive تعرض كل البيانات التي يحتاجها فريق الميديا (Media Team) في شركات الإنتاج السينمائي. يتم الوصول إليها بالضغط على DriveCard من الـ Dashboard.

---

## Navigation
- **Entry Point:** الضغط على DriveCard في DashboardScreen
- **Back:** زر رجوع في أعلى الصفحة يعود إلى Dashboard
- **URL Pattern:** `drive/:driveId`

---

## Screen Layout (Top → Bottom)

### 1. Header Bar
```
[← Back] [Drive Icon] Drive Name                    [Status Badge]
         /Volumes/HD-SG5                             ● Connected
```
- **Drive Name** — bold, 20px
- **Mount Path** — text-secondary, 14px
- **Status Badge** — green dot + "Connected" / red dot + "Disconnected"

---

### 2. Drive Summary Cards (Grid 4 columns)

| Card | Icon | Value | Subtitle |
|------|------|-------|----------|
| Total Size | HardDrive | 2.0 TB | — |
| Total Videos | Film | 1,247 | files |
| Total Keyframes | Image | 15,830 | frames extracted |
| Last Indexed | Calendar | Jul 12, 2026 | 14:30 |

---

### 3. Indexing Status Section

#### 3.1 Status Banner
```
┌─────────────────────────────────────────────────────┐
│  [Icon] Indexing In Progress          [Pause] [Stop] │
│  ████████████░░░░░░░░░░░░  45%                       │
│  Video 12/1,247 · Frame 45/120 (38%) · ETA: 2h 15m   │
└─────────────────────────────────────────────────────┘
```

**States:**
- **In Progress** — blue accent, animated progress bar, pause/stop buttons
- **Paused** — yellow accent, resume/stop buttons
- **Completed** — green banner with checkmark, "Indexing completed on Jul 12"
- **Not Indexed** — gray banner, "Index Now" button
- **Failed** — red banner with error message, "Retry" button

#### 3.2 Indexing Statistics Table
| Metric | Value |
|--------|-------|
| Videos Indexed | 1,200 / 1,247 |
| Videos Remaining | 47 |
| Keyframes Extracted | 15,830 |
| Average Keyframes/Video | 12.7 |
| Indexing Duration | 3h 42m |
| Storage Used (Thumbnails) | 245 MB |
| Failed Videos | 2 |

---

### 4. Video Library Section

#### 4.1 Filter & Search Bar
```
[🔍 Search videos...]  [All Formats ▾]  [Sort: Name ▾]  [Grid ▾] [List ▾]
```

#### 4.2 Video Grid (Card per video)
```
┌─────────────────────────────┐
│    [Thumbnail Preview]       │
│                              │
│  video_filename.mp4          │
│  Duration: 12:34             │
│  Keyframes: 152              │
│  Size: 1.2 GB                │
│  Format: MP4 (H.264)         │
│  ─────────────────────────── │
│  [Lighting: Outdoor]         │
│  [Time: Daytime]             │
│  [Shooting: Handheld]        │
│  [View Keyframes →]          │
└─────────────────────────────┘
```

**Per Video Card Data:**
- Thumbnail (first keyframe)
- Filename
- Duration (formatted: HH:MM:SS)
- Keyframe count
- File size (from disk)
- Format / Codec
- AI Tags: Lighting, Time of Day, Shooting Type
- "View Keyframes" button → opens keyframe gallery for this video

#### 4.3 Video List View (Alternative)
Table with columns: Filename, Duration, Keyframes, Size, Format, Status, Actions

---

### 5. Keyframe Gallery (Per Video or All)

#### 5.1 Grid View
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ [img]│ │ [img]│ │ [img]│ │ [img]│ │ [img]│
│00:05 │ │00:10 │ │00:15 │ │00:20 │ │00:25 │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

**Per Keyframe:**
- Thumbnail image (320px width, JPEG 70%)
- Timestamp (00:05 format)
- Tags (lighting, time_of_day, shooting_type)
- Click → opens full preview with:
  - Full resolution image
  - All metadata
  - Associated people/faces
  - Scene category
  - Notes field
  - Tags list

---

### 6. AI Analysis Summary Section

#### 6.1 Lighting Distribution
```
Lighting Breakdown:
  Outdoor    ████████████████  62%  (9,815 frames)
  Indoor     ██████            25%  (3,958 frames)
  Studio     ██                 8%  (1,266 frames)
  Low Light  █                  5%  (791 frames)
```

#### 6.2 Time of Day Distribution
```
Time of Day:
  Daytime    ██████████████     55%
  Golden Hr  █████              20%
  Night      ████               15%
  Sunset     ██                 10%
```

#### 6.3 Shooting Type Distribution
```
Shooting Type:
  Handheld   ███████████        45%
  Tripod     ████████           30%
  Drone      ████               15%
  Gimbal     ██                 10%
```

#### 6.4 Scene Categories (Tag cloud or chips)
```
[Beach] [City] [Desert] [Studio] [Forest] [Indoor] [Night] [Wedding] [Interview]
```
Each chip shows count: `Beach (1,245)`

---

### 7. People / Cast Section

#### 7.1 People Grid
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ [Avatar]  │  │ [Avatar]  │  │ [Avatar]  │
│ Ahmed     │  │ Unknown 3 │  │ Sara      │
│ 245 frames│  │ 89 frames │  │ 156 frames│
│ 12 videos │  │ 5 videos  │  │ 8 videos  │
└──────────┘  └──────────┘  └──────────┘
```

**Per Person Card:**
- Profile image (best face detection)
- Name (or "Unknown N")
- Frame count
- Video count
- Confidence score
- Click → opens all keyframes with this person

---

### 8. Storage & Health Section

#### 8.1 Storage Breakdown
```
Storage Usage:
  Video Files:        1.8 TB (90%)
  Thumbnails:         245 MB (0.01%)
  Database:           12 MB
  Total Used:         1.8 TB / 2.0 TB
```

#### 8.2 Drive Health
```
Drive Health:
  Status:              Connected
  Mount Point:         /Volumes/HD-SG5
  File System:         exFAT
  Connection:          USB 3.2
  Writable:            Yes
  SMART Status:        Healthy (if available)
```

#### 8.3 QR Code
- Display QR code for mobile access
- "Regenerate QR" button
- "Print QR" button

---

### 9. Actions Bar (Sticky Bottom or Top Right)

| Action | Icon | Behavior |
|--------|------|----------|
| Re-index | Refresh | Re-scan drive for new/changed videos |
| Pause Indexing | Pause | Pause current indexing |
| Resume Indexing | Play | Resume paused indexing |
| Stop Indexing | Square | Stop and save progress |
| Export Report | Download | Export CSV/PDF summary |
| Open in Finder | Folder | Open mount path in Finder |
| Eject Drive | Eject | Safely eject drive |
| Delete Drive | Trash | Remove drive + all data |

---

## Color Tokens (from existing design system)

| Token | Usage |
|-------|-------|
| `ff-bg` | Page background |
| `ff-surface` | Card backgrounds |
| `ff-accent` | Primary actions, progress bars |
| `ff-text-primary` | Headings, values |
| `ff-text-secondary` | Labels, subtitles |
| `green-500` | Connected, completed |
| `red-500` | Disconnected, errors |
| `yellow-500` | Paused, warnings |

---

## Typography

| Element | Size | Weight |
|---------|------|--------|
| Page Title (Drive Name) | 24px | bold |
| Section Headers | 16px | semibold |
| Card Values | 20px | bold |
| Card Labels | 12px | normal |
| Table Headers | 12px | medium |
| Table Data | 14px | normal |
| Status Badges | 12px | medium |

---

## Responsive Behavior

- **Full Width:** 4-column summary cards, video grid 4-5 columns
- **Medium (< 1200px):** 2-column summary cards, video grid 3 columns
- **Small (< 768px):** 1-column summary cards, video grid 2 columns

---

## Data Sources (IPC Calls Needed)

| Data | IPC Channel | Returns |
|------|-------------|---------|
| Drive info | `drives:getById` | Drive object |
| Video count | `videos:countByDriveId` | number |
| Video list | `videos:getByDriveId` | Video[] |
| Keyframe count | `keyframes:countByDriveId` | number |
| Keyframes by video | `keyframes:getByVideoId` | Keyframe[] |
| Indexing status | `indexing:status` | IndexingState |
| Indexing stats | `indexing:stats` | { total, completed, failed, keyframes } |
| People on drive | `people:getByDriveId` | Person[] |
| Scene categories | `scenes:getByDriveId` | SceneCategory[] |
| Storage info | `drives:getStorageInfo` | { videoSize, thumbSize, dbSize } |
| Export report | `drives:exportReport` | file path |

---

## Empty States

| State | Display |
|-------|---------|
| No videos found | "No videos detected on this drive. Click Re-index to scan." |
| Not indexed | "Drive not indexed yet. Click Index Now to start." |
| No keyframes | "No keyframes extracted yet." |
| No people detected | "No faces detected. Run AI analysis after indexing." |
| Drive disconnected | "Drive is not connected. Connect the drive to view data." |

---

## Notes for Figma Designer

1. Use macOS native feel — rounded corners (8px), subtle shadows
2. Dark theme primary (matching existing FrameFinder design)
3. All data sections should be collapsible (accordion)
4. Video grid should support lazy loading / virtual scroll for large drives
5. Keyframe gallery should support lightbox view
6. Progress bar should be the same component as `IndexingProgressBar` but larger
7. Export Report should generate a PDF summary for production teams
8. Consider adding a "Notes" field per video for production team annotations
