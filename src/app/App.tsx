import { useState, useEffect, useRef, useMemo } from "react";
import {
  HardDrive,
  Search,
  Users,
  CheckSquare,
  Settings,
  Plus,
  QrCode,
  RefreshCw,
  Wifi,
  WifiOff,
  Check,
  X,
  SkipForward,
  Server,
  Database,
  Sliders,
  Info,
  Edit2,
  GitMerge,
  Clock,
  Film,
  AlertCircle,
  Zap,
  LayoutGrid,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DriveStatus = "connected" | "disconnected" | "indexing";
type Screen = "dashboard" | "search" | "scenes" | "people" | "reviews" | "settings";

interface Drive {
  id: string;
  name: string;
  status: DriveStatus;
  videoCount: number;
  lastIndexed: string;
  indexProgress?: number;
  sizeGB: number;
}

interface SearchResult {
  id: string;
  thumbnail: string;
  videoName: string;
  driveName: string;
  timestamp: string;
  similarity: number;
  driveConnected: boolean;
}

interface Person {
  id: string;
  name: string | null;
  faceUrl: string;
  appearances: number;
  known: boolean;
}

interface PendingReview {
  id: string;
  faceUrl: string;
  profileUrl: string;
  suggestedName: string;
  confidence: number;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_DRIVES: Drive[] = [
  { id: "d1", name: "WD_BLACK 4TB", status: "connected", videoCount: 2847, lastIndexed: "Today, 09:41", sizeGB: 4000 },
  { id: "d2", name: "Seagate Backup", status: "indexing", videoCount: 1203, lastIndexed: "Indexing…", indexProgress: 62, sizeGB: 2000 },
  { id: "d3", name: "Samsung T7 Shield", status: "disconnected", videoCount: 589, lastIndexed: "Jun 28, 2025", sizeGB: 1000 },
  { id: "d4", name: "LaCie Rugged SSD", status: "connected", videoCount: 4112, lastIndexed: "Today, 07:15", sizeGB: 2000 },
  { id: "d5", name: "G-DRIVE ArmorATD", status: "disconnected", videoCount: 318, lastIndexed: "May 14, 2025", sizeGB: 4000 },
];

const SEARCH_RESULTS: SearchResult[] = [
  { id: "r1", thumbnail: "https://images.unsplash.com/photo-1536240478700-b869ad10e2ab?w=160&h=90&fit=crop&auto=format", videoName: "wedding_ceremony_final.mp4", driveName: "WD_BLACK 4TB", timestamp: "00:14:32", similarity: 97, driveConnected: true },
  { id: "r2", thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&h=90&fit=crop&auto=format", videoName: "concert_night_raw.mp4", driveName: "Samsung T7 Shield", timestamp: "01:02:08", similarity: 91, driveConnected: false },
  { id: "r3", thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=160&h=90&fit=crop&auto=format", videoName: "family_reunion_2024.mp4", driveName: "WD_BLACK 4TB", timestamp: "00:27:44", similarity: 88, driveConnected: true },
  { id: "r4", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=90&fit=crop&auto=format", videoName: "birthday_party_edit.mp4", driveName: "LaCie Rugged SSD", timestamp: "00:03:17", similarity: 85, driveConnected: true },
  { id: "r5", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=160&h=90&fit=crop&auto=format", videoName: "graduation_ceremony.mp4", driveName: "G-DRIVE ArmorATD", timestamp: "00:48:59", similarity: 79, driveConnected: false },
  { id: "r6", thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=160&h=90&fit=crop&auto=format", videoName: "street_documentary.mp4", driveName: "WD_BLACK 4TB", timestamp: "02:11:03", similarity: 74, driveConnected: true },
];

const PEOPLE: Person[] = [
  { id: "p1", name: "Sarah Johnson", faceUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", appearances: 312, known: true },
  { id: "p2", name: "Marcus Webb", faceUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", appearances: 247, known: true },
  { id: "p3", name: null, faceUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", appearances: 89, known: false },
  { id: "p4", name: "Elena Vasquez", faceUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format", appearances: 178, known: true },
  { id: "p5", name: null, faceUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&auto=format", appearances: 34, known: false },
  { id: "p6", name: "David Kim", faceUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format", appearances: 93, known: true },
  { id: "p7", name: null, faceUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format", appearances: 21, known: false },
  { id: "p8", name: "Priya Nair", faceUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&auto=format", appearances: 155, known: true },
];

const PENDING_REVIEWS: PendingReview[] = [
  { id: "rv1", faceUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=180&h=180&fit=crop&auto=format", profileUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format", suggestedName: "Marcus Webb", confidence: 94 },
  { id: "rv2", faceUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&h=180&fit=crop&auto=format", profileUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format", suggestedName: "Sarah Johnson", confidence: 78 },
  { id: "rv3", faceUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=180&h=180&fit=crop&auto=format", profileUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format", suggestedName: "Elena Vasquez", confidence: 61 },
  { id: "rv4", faceUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=180&h=180&fit=crop&auto=format", profileUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop&auto=format", suggestedName: "Priya Nair", confidence: 88 },
  { id: "rv5", faceUrl: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=180&h=180&fit=crop&auto=format", profileUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format", suggestedName: "David Kim", confidence: 71 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function confidenceColor(score: number) {
  if (score >= 85) return "#32D74B";
  if (score >= 65) return "#FF9F0A";
  return "#FF453A";
}

function StatusBadge({ status }: { status: DriveStatus }) {
  const map = {
    connected: { label: "Connected", color: "#32D74B", bg: "rgba(50,215,75,0.12)" },
    disconnected: { label: "Disconnected", color: "rgba(235,235,245,0.4)", bg: "rgba(235,235,245,0.06)" },
    indexing: { label: "Indexing…", color: "#0A84FF", bg: "rgba(10,132,255,0.12)" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium"
      style={{ color: s.color, background: s.bg }}
    >
      <span className="size-1.5 rounded-full inline-block" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

// ─── Window Chrome ────────────────────────────────────────────────────────────

function WindowChrome({ title }: { title: string }) {
  return (
    <div
      className="flex items-center gap-0 h-11 px-4 shrink-0"
      style={{ background: "#1C1C1E", borderBottom: "1px solid #38383A", WebkitAppRegion: "drag" as never }}
    >
      <div className="flex items-center gap-2 mr-4">
        <div className="size-3 rounded-full" style={{ background: "#FF5F57" }} />
        <div className="size-3 rounded-full" style={{ background: "#FFBD2E" }} />
        <div className="size-3 rounded-full" style={{ background: "#28C840" }} />
      </div>
      <span className="text-[13px] font-medium text-white/60 mx-auto">{title}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: HardDrive },
  { id: "search", label: "Smart Search", icon: Search },
  { id: "scenes", label: "Scenes", icon: LayoutGrid },
  { id: "people", label: "People", icon: Users },
  { id: "reviews", label: "Reviews", icon: CheckSquare, badge: 35 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function Sidebar({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  return (
    <div
      className="flex flex-col shrink-0 h-full"
      style={{ width: 220, background: "#1C1C1E", borderRight: "1px solid #38383A" }}
    >
      {/* App name */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2.5">
        <div className="size-7 rounded-lg flex items-center justify-center" style={{ background: "#0A84FF" }}>
          <Film size={14} className="text-white" />
        </div>
        <span className="text-[15px] font-semibold text-white">FrameFinder</span>
      </div>

      <div className="px-2 pb-2">
        <div className="h-px" style={{ background: "#38383A" }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id as Screen)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors"
              style={{
                background: isActive ? "rgba(10,132,255,0.18)" : "transparent",
                color: isActive ? "#0A84FF" : "rgba(235,235,245,0.75)",
              }}
            >
              <Icon size={15} />
              <span className="text-[13px] font-medium flex-1">{label}</span>
              {badge && (
                <span
                  className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                  style={{ background: "#FF453A", color: "#fff", minWidth: 18, textAlign: "center" }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage summary */}
      <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid #38383A" }}>
        <p className="text-[11px] mb-1" style={{ color: "rgba(235,235,245,0.4)" }}>Storage Used</p>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "#3A3A3C" }}>
          <div className="h-full rounded-full" style={{ width: "67%", background: "#0A84FF" }} />
        </div>
        <p className="text-[11px] mt-1" style={{ color: "rgba(235,235,245,0.4)" }}>8.9 TB of 13 TB</p>
      </div>
    </div>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────

function QRModal({ drive, onClose }: { drive: Drive; onClose: () => void }) {
  const qrCells = useMemo(
    () => Array.from({ length: 49 }).map(() => Math.random() > 0.5),
    [drive.id]
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 flex flex-col items-center gap-4"
        style={{ background: "#2C2C2E", border: "1px solid #38383A", width: 280 }}
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[13px] font-semibold text-white">{drive.name}</p>
        {/* Simple QR placeholder */}
        <div className="size-40 rounded-lg grid grid-cols-7 gap-0.5 p-2" style={{ background: "#fff" }}>
          {qrCells.map((on, i) => (
            <div
              key={i}
              className="rounded-[1px]"
              style={{ background: on ? "#000" : "#fff", aspectRatio: "1" }}
            />
          ))}
        </div>
        <p className="text-[11px] text-center" style={{ color: "rgba(235,235,245,0.5)" }}>
          Scan to locate this drive
        </p>
        <button
          onClick={onClose}
          className="text-[13px] font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#0A84FF", color: "#fff" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function DriveCard({ drive, onQR }: { drive: Drive; onQR: (d: Drive) => void }) {
  const isConnected = drive.status === "connected";
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all"
      style={{
        background: "#2C2C2E",
        border: isConnected ? "1.5px solid #0A84FF" : "1px solid #38383A",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="size-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(235,235,245,0.06)" }}
          >
            <HardDrive size={18} style={{ color: isConnected ? "#0A84FF" : "rgba(235,235,245,0.3)" }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-tight">{drive.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(235,235,245,0.45)" }}>
              {drive.sizeGB >= 1000 ? `${drive.sizeGB / 1000} TB` : `${drive.sizeGB} GB`}
            </p>
          </div>
        </div>
        <StatusBadge status={drive.status} />
      </div>

      {drive.status === "indexing" && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px]" style={{ color: "#0A84FF" }}>Indexing</span>
            <span className="text-[11px]" style={{ color: "#0A84FF" }}>{drive.indexProgress}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "#3A3A3C" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${drive.indexProgress}%`, background: "#0A84FF" }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div>
          <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.45)" }}>Videos</p>
          <p className="text-[13px] font-semibold text-white">{drive.videoCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.45)" }}>Last Indexed</p>
          <p className="text-[13px] font-medium text-white">{drive.lastIndexed}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid #38383A" }}>
        <button
          onClick={() => onQR(drive)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors hover:opacity-80"
          style={{ background: "rgba(235,235,245,0.06)", color: "rgba(235,235,245,0.7)" }}
        >
          <QrCode size={12} />
          QR Code
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors hover:opacity-80"
          style={{
            background: drive.status === "disconnected" ? "rgba(235,235,245,0.06)" : "rgba(10,132,255,0.15)",
            color: drive.status === "disconnected" ? "rgba(235,235,245,0.3)" : "#0A84FF",
          }}
          disabled={drive.status === "disconnected"}
        >
          <RefreshCw size={12} />
          Index Now
        </button>
      </div>
    </div>
  );
}

function DashboardScreen() {
  const [drives] = useState<Drive[]>(INITIAL_DRIVES);
  const [qrDrive, setQrDrive] = useState<Drive | null>(null);
  const [showAddDrive, setShowAddDrive] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ borderBottom: "1px solid #38383A" }}
      >
        <div>
          <h1 className="text-[16px] font-semibold text-white">Drive Manager</h1>
          <p className="text-[12px]" style={{ color: "rgba(235,235,245,0.5)" }}>
            {drives.filter(d => d.status === "connected").length} connected · {drives.length} total
          </p>
        </div>
        <button
          onClick={() => setShowAddDrive(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ background: "#0A84FF", color: "#fff" }}
        >
          <Plus size={14} />
          Add New Drive
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {drives.map(drive => (
            <DriveCard key={drive.id} drive={drive} onQR={setQrDrive} />
          ))}
        </div>
      </div>

      {qrDrive && <QRModal drive={qrDrive} onClose={() => setQrDrive(null)} />}
      {showAddDrive && <AddDriveModal onClose={() => setShowAddDrive(false)} />}
    </div>
  );
}

// ─── Screen: Smart Search ─────────────────────────────────────────────────────

function SearchScreen({ prefill = "", onClear }: { prefill?: string; onClear?: () => void }) {
  const [query, setQuery] = useState(prefill);
  const [mode, setMode] = useState<"text" | "image">("text");
  const [offline] = useState(false);
  const [hoveredResult, setHoveredResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 0 ? SEARCH_RESULTS : [];

  useEffect(() => {
    if (prefill) setQuery(prefill);
    inputRef.current?.focus();
  }, [prefill]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-4 pb-3 shrink-0" style={{ borderBottom: "1px solid #38383A" }}>
        <h1 className="text-[16px] font-semibold text-white mb-3">Smart Search</h1>

        {offline && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-[12px]"
            style={{ background: "rgba(255,159,10,0.12)", color: "#FF9F0A", border: "1px solid rgba(255,159,10,0.25)" }}
          >
            <WifiOff size={13} />
            Offline mode: text search only
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(235,235,245,0.4)" }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search scenes, people, moments…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] text-white placeholder-[rgba(235,235,245,0.35)] outline-none transition-all"
              style={{ background: "#2C2C2E", border: "1px solid #38383A" }}
            />
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #38383A" }}>
            {(["text", "image"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-3 py-2 text-[12px] font-medium capitalize transition-colors"
                style={{
                  background: mode === m ? "#0A84FF" : "#2C2C2E",
                  color: mode === m ? "#fff" : "rgba(235,235,245,0.5)",
                }}
              >
                {m === "text" ? "Text" : "Image"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="size-12 rounded-full flex items-center justify-center" style={{ background: "#2C2C2E" }}>
              <Search size={22} style={{ color: "rgba(235,235,245,0.25)" }} />
            </div>
            <p className="text-[14px] font-medium" style={{ color: "rgba(235,235,245,0.4)" }}>
              {query.length === 0 ? "Type to search across all drives" : "No results found"}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[12px] mb-4" style={{ color: "rgba(235,235,245,0.45)" }}>
              {results.length} results for "{query}"
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {results.map(r => (
                <div
                  key={r.id}
                  className="group flex gap-3 rounded-xl p-3 transition-colors relative"
                  style={{ background: "#2C2C2E", border: "1px solid #38383A" }}
                  onMouseEnter={() => setHoveredResult(r.id)}
                  onMouseLeave={() => setHoveredResult(null)}
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 rounded-lg overflow-hidden" style={{ width: 100, height: 56, background: "#3A3A3C" }}>
                    <img src={r.thumbnail} alt={r.videoName} className="w-full h-full object-cover" />
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white truncate">{r.videoName}</p>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(235,235,245,0.45)" }}>
                      {r.driveName}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className="text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                        style={{ color: "rgba(235,235,245,0.55)" }}
                        title="Click to copy"
                      >
                        <Clock size={10} />
                        {r.timestamp}
                      </span>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: confidenceColor(r.similarity) }}
                      >
                        {r.similarity}%
                      </span>
                    </div>
                  </div>

                  {/* Locate Drive hover */}
                  {!r.driveConnected && hoveredResult === r.id && (
                    <div
                      className="absolute right-3 bottom-3 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
                      style={{ background: "#FF9F0A", color: "#000" }}
                    >
                      <AlertCircle size={10} />
                      Locate Drive
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: People ───────────────────────────────────────────────────────────

function PeopleScreen() {
  const [tab, setTab] = useState<"all" | "known" | "unknown">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [unknownCount, setUnknownCount] = useState(0);

  const filtered = PEOPLE.filter(p => {
    if (tab === "known") return p.known;
    if (tab === "unknown") return !p.known;
    return true;
  });

  useEffect(() => {
    setUnknownCount(PEOPLE.filter(p => !p.known).length);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 shrink-0" style={{ borderBottom: "1px solid #38383A" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[16px] font-semibold text-white">People</h1>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "rgba(235,235,245,0.06)", color: "rgba(235,235,245,0.6)" }}
          >
            <GitMerge size={13} />
            Merge Profiles
          </button>
        </div>
        <div className="flex" style={{ borderBottom: "1px solid #38383A" }}>
          {(["all", "known", "unknown"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 text-[13px] font-medium capitalize transition-colors"
              style={{
                color: tab === t ? "#0A84FF" : "rgba(235,235,245,0.5)",
                borderBottom: tab === t ? "2px solid #0A84FF" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t}
              {t === "unknown" && unknownCount > 0 && (
                <span
                  className="ml-1.5 text-[10px] font-semibold rounded-full px-1.5"
                  style={{ background: "rgba(255,69,58,0.18)", color: "#FF453A" }}
                >
                  {unknownCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {filtered.map((person, idx) => {
            const displayName = names[person.id] ?? person.name;
            const isEditing = editingId === person.id;
            return (
              <div
                key={person.id}
                className="group rounded-xl p-4 flex flex-col items-center gap-2.5"
                style={{ background: "#2C2C2E", border: "1px solid #38383A" }}
              >
                <div className="relative">
                  <img
                    src={person.faceUrl}
                    alt={displayName ?? `Unknown #${idx + 1}`}
                    className="size-14 rounded-full object-cover"
                    style={{ border: person.known ? "2px solid #32D74B" : "2px solid #38383A" }}
                  />
                  {!person.known && (
                    <div
                      className="absolute -bottom-1 -right-1 size-5 rounded-full flex items-center justify-center"
                      style={{ background: "#FF9F0A" }}
                    >
                      <span className="text-[9px] font-bold text-black">?</span>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <input
                    autoFocus
                    defaultValue={displayName ?? ""}
                    className="text-[12px] text-white text-center bg-transparent border-b outline-none w-full"
                    style={{ borderColor: "#0A84FF" }}
                    onBlur={e => {
                      setNames(n => ({ ...n, [person.id]: e.target.value }));
                      setEditingId(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        setNames(n => ({ ...n, [person.id]: (e.target as HTMLInputElement).value }));
                        setEditingId(null);
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-medium text-white text-center">
                      {displayName ?? `Unknown #${idx + 1}`}
                    </p>
                    <button
                      onClick={() => setEditingId(person.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 size={10} style={{ color: "rgba(235,235,245,0.4)" }} />
                    </button>
                  </div>
                )}

                <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.4)" }}>
                  {person.appearances} appearances
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Pending Reviews ──────────────────────────────────────────────────

function ReviewsScreen() {
  const [reviews, setReviews] = useState<PendingReview[]>(PENDING_REVIEWS);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const total = PENDING_REVIEWS.length;

  const current = reviews[selectedIdx];

  function advance(action: "confirm" | "reject" | "skip") {
    if (action !== "skip") {
      setReviewed(r => r + 1);
      setReviews(prev => prev.filter((_, i) => i !== selectedIdx));
      setSelectedIdx(prev => Math.min(prev, reviews.length - 2));
    } else {
      setSelectedIdx(prev => (prev + 1) % reviews.length);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "y" || e.key === "Y") advance("confirm");
      if (e.key === "n" || e.key === "N") advance("reject");
      if (e.key === "ArrowRight") advance("skip");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reviews, selectedIdx]);

  const confColor = current ? confidenceColor(current.confidence) : "#32D74B";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header / Progress */}
      <div className="px-6 py-3 shrink-0" style={{ borderBottom: "1px solid #38383A" }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[16px] font-semibold text-white">Pending Reviews</h1>
          <span className="text-[12px]" style={{ color: "rgba(235,235,245,0.5)" }}>
            {reviewed} of {total} reviewed
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "#3A3A3C" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(reviewed / total) * 100}%`, background: "#0A84FF" }}
          />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="size-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(50,215,75,0.12)" }}
          >
            <Check size={32} style={{ color: "#32D74B" }} />
          </div>
          <p className="text-[18px] font-semibold text-white">All Done!</p>
          <p className="text-[13px]" style={{ color: "rgba(235,235,245,0.5)" }}>
            All {total} faces have been reviewed.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel — list */}
          <div
            className="overflow-y-auto shrink-0"
            style={{ width: 260, borderRight: "1px solid #38383A" }}
          >
            <div className="px-3 py-2">
              <p className="text-[11px] font-medium mb-2" style={{ color: "rgba(235,235,245,0.4)" }}>
                PENDING ({reviews.length})
              </p>
              {reviews.map((rv, idx) => (
                <button
                  key={rv.id}
                  onClick={() => setSelectedIdx(idx)}
                  className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg mb-1 text-left transition-colors"
                  style={{
                    background: selectedIdx === idx ? "#3A3A3C" : "transparent",
                    border: selectedIdx === idx ? "1px solid #0A84FF" : "1px solid transparent",
                  }}
                >
                  <img
                    src={rv.faceUrl}
                    alt={rv.suggestedName}
                    className="size-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white truncate">{rv.suggestedName}</p>
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: confidenceColor(rv.confidence) }}
                    >
                      {rv.confidence}% match
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel — detail */}
          {current && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              {/* Face comparison */}
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={current.faceUrl}
                    alt="Detected face"
                    className="rounded-2xl object-cover"
                    style={{ width: 160, height: 160 }}
                  />
                  <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.45)" }}>Detected</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div
                    className="text-[28px] font-bold"
                    style={{ color: confColor }}
                  >
                    {current.confidence}%
                  </div>
                  <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.4)" }}>match</p>
                  {/* Confidence bar */}
                  <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "#3A3A3C" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${current.confidence}%`, background: confColor }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <img
                    src={current.profileUrl}
                    alt={current.suggestedName}
                    className="rounded-2xl object-cover"
                    style={{ width: 160, height: 160 }}
                  />
                  <p className="text-[13px] font-semibold text-white">{current.suggestedName}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => advance("confirm")}
                  className="flex flex-col items-center gap-1.5 px-8 py-4 rounded-2xl font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "rgba(50,215,75,0.15)", border: "1.5px solid #32D74B", color: "#32D74B", minWidth: 120 }}
                >
                  <Check size={24} />
                  <span className="text-[14px]">Confirm</span>
                  <span className="text-[11px] font-mono opacity-60">Y</span>
                </button>

                <button
                  onClick={() => advance("skip")}
                  className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl font-medium transition-opacity hover:opacity-80"
                  style={{ background: "rgba(235,235,245,0.06)", border: "1px solid #38383A", color: "rgba(235,235,245,0.5)" }}
                >
                  <SkipForward size={18} />
                  <span className="text-[12px]">Skip</span>
                  <span className="text-[11px] font-mono opacity-60">→</span>
                </button>

                <button
                  onClick={() => advance("reject")}
                  className="flex flex-col items-center gap-1.5 px-8 py-4 rounded-2xl font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "rgba(255,69,58,0.15)", border: "1.5px solid #FF453A", color: "#FF453A", minWidth: 120 }}
                >
                  <X size={24} />
                  <span className="text-[14px]">Reject</span>
                  <span className="text-[11px] font-mono opacity-60">N</span>
                </button>
              </div>

              <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.3)" }}>
                Keyboard shortcuts: <span className="font-mono">Y</span> confirm · <span className="font-mono">N</span> reject · <span className="font-mono">→</span> skip
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────

function SettingsScreen() {
  const [serverUrl, setServerUrl] = useState("http://localhost:8000");
  const [connStatus, setConnStatus] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const [autoConfirm, setAutoConfirm] = useState(85);
  const [autoReject, setAutoReject] = useState(65);
  const [density, setDensity] = useState<"low" | "medium" | "high">("medium");

  function testConnection() {
    setConnStatus("testing");
    setTimeout(() => setConnStatus("ok"), 1800);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 shrink-0" style={{ borderBottom: "1px solid #38383A" }}>
        <h1 className="text-[16px] font-semibold text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxWidth: 640 }}>

        {/* Server Configuration */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Server size={14} style={{ color: "#0A84FF" }} />
            <h2 className="text-[13px] font-semibold text-white">Server Configuration</h2>
          </div>
          <div className="rounded-xl p-4 space-y-3" style={{ background: "#2C2C2E", border: "1px solid #38383A" }}>
            <div>
              <label className="text-[11px] block mb-1.5" style={{ color: "rgba(235,235,245,0.5)" }}>
                API Server URL
              </label>
              <div className="flex gap-2">
                <input
                  value={serverUrl}
                  onChange={e => setServerUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-[13px] text-white outline-none font-mono"
                  style={{ background: "#1C1C1E", border: "1px solid #38383A" }}
                />
                <button
                  onClick={testConnection}
                  disabled={connStatus === "testing"}
                  className="px-3 py-2 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80 flex items-center gap-1.5"
                  style={{ background: "#0A84FF", color: "#fff" }}
                >
                  <Wifi size={12} />
                  {connStatus === "testing" ? "Testing…" : "Test"}
                </button>
              </div>
              {connStatus === "ok" && (
                <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: "#32D74B" }}>
                  <Check size={10} /> Connected successfully
                </p>
              )}
              {connStatus === "fail" && (
                <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: "#FF453A" }}>
                  <X size={10} /> Connection failed
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Confidence Thresholds */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sliders size={14} style={{ color: "#0A84FF" }} />
            <h2 className="text-[13px] font-semibold text-white">Confidence Thresholds</h2>
          </div>
          <div className="rounded-xl p-4 space-y-4" style={{ background: "#2C2C2E", border: "1px solid #38383A" }}>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[11px]" style={{ color: "rgba(235,235,245,0.5)" }}>
                  Auto-Confirm above
                </label>
                <span className="text-[12px] font-semibold" style={{ color: "#32D74B" }}>{autoConfirm}%</span>
              </div>
              <input
                type="range" min={50} max={99} value={autoConfirm}
                onChange={e => setAutoConfirm(Number(e.target.value))}
                className="w-full accent-green-400"
                style={{ accentColor: "#32D74B" }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[11px]" style={{ color: "rgba(235,235,245,0.5)" }}>
                  Auto-Reject below
                </label>
                <span className="text-[12px] font-semibold" style={{ color: "#FF453A" }}>{autoReject}%</span>
              </div>
              <input
                type="range" min={1} max={60} value={autoReject}
                onChange={e => setAutoReject(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "#FF453A" }}
              />
            </div>
            <div
              className="flex text-[11px] rounded-lg overflow-hidden"
              style={{ background: "#1C1C1E" }}
            >
              <div className="flex-none px-2 py-2 text-center" style={{ width: `${autoReject}%`, background: "rgba(255,69,58,0.2)", color: "#FF453A" }}>
                Auto-Reject
              </div>
              <div className="flex-none px-2 py-2 text-center" style={{ width: `${Math.max(0, autoConfirm - autoReject)}%`, background: "rgba(255,159,10,0.12)", color: "#FF9F0A" }}>
                Manual Review
              </div>
              <div className="flex-none px-2 py-2 text-center" style={{ width: `${100 - autoConfirm}%`, background: "rgba(50,215,75,0.15)", color: "#32D74B" }}>
                Auto-Confirm
              </div>
            </div>
          </div>
        </section>

        {/* Indexing Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} style={{ color: "#0A84FF" }} />
            <h2 className="text-[13px] font-semibold text-white">Indexing Settings</h2>
          </div>
          <div className="rounded-xl p-4" style={{ background: "#2C2C2E", border: "1px solid #38383A" }}>
            <label className="text-[11px] block mb-3" style={{ color: "rgba(235,235,245,0.5)" }}>
              Keyframe Extraction Density
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className="flex-1 py-2 rounded-lg text-[12px] font-medium capitalize transition-colors"
                  style={{
                    background: density === d ? "#0A84FF" : "#1C1C1E",
                    color: density === d ? "#fff" : "rgba(235,235,245,0.5)",
                    border: `1px solid ${density === d ? "#0A84FF" : "#38383A"}`,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-2" style={{ color: "rgba(235,235,245,0.35)" }}>
              {density === "low" && "1 keyframe per 30s — fast, lower coverage"}
              {density === "medium" && "1 keyframe per 10s — balanced (recommended)"}
              {density === "high" && "1 keyframe per 3s — thorough, slower indexing"}
            </p>
          </div>
        </section>

        {/* Storage Info */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} style={{ color: "#0A84FF" }} />
            <h2 className="text-[13px] font-semibold text-white">Storage</h2>
          </div>
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#2C2C2E", border: "1px solid #38383A" }}>
            <div>
              <p className="text-[13px] text-white font-medium">framefinder.db</p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(235,235,245,0.45)" }}>4.7 GB · 9,069 videos indexed</p>
            </div>
            <button
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
              style={{ background: "rgba(235,235,245,0.06)", color: "rgba(235,235,245,0.6)", border: "1px solid #38383A" }}
            >
              Vacuum DB
            </button>
          </div>
        </section>

        {/* About */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Info size={14} style={{ color: "#0A84FF" }} />
            <h2 className="text-[13px] font-semibold text-white">About</h2>
          </div>
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#2C2C2E", border: "1px solid #38383A" }}>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: "#0A84FF" }}>
                <Film size={15} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">FrameFinder</p>
                <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.45)" }}>Version 1.0.0 (build 204)</p>
              </div>
            </div>
            <p className="text-[11px]" style={{ color: "rgba(235,235,245,0.35)" }}>© 2025 FrameFinder</p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Screen: Scenes ───────────────────────────────────────────────────────────

const DRIVE_COLORS: Record<string, string> = {
  d1: "#0A84FF",
  d2: "#32D74B",
  d3: "#FF9F0A",
  d4: "#BF5AF2",
  d5: "#FF453A",
};

const DRIVE_NAMES: Record<string, string> = {
  d1: "WD_BLACK 4TB",
  d2: "Seagate Backup",
  d3: "Samsung T7 Shield",
  d4: "LaCie Rugged SSD",
  d5: "G-DRIVE ArmorATD",
};

const SCENE_CATEGORIES = [
  { label: "Outdoor",    count: 312, drives: ["d1","d4"],       lighting: "natural",     time: "day",          shooting: "wide",     image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop&auto=format" },
  { label: "Concert",    count: 87,  drives: ["d2"],             lighting: "low-light",   time: "night",        shooting: "wide",     image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=240&fit=crop&auto=format" },
  { label: "Wedding",    count: 54,  drives: ["d1"],             lighting: "natural",     time: "golden-hour",  shooting: "close-up", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=240&fit=crop&auto=format" },
  { label: "Sports",     count: 201, drives: ["d1","d4"],       lighting: "natural",     time: "day",          shooting: "wide",     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&auto=format" },
  { label: "Night",      count: 143, drives: ["d4"],             lighting: "low-light",   time: "night",        shooting: "outdoor",  image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=240&fit=crop&auto=format" },
  { label: "People",     count: 489, drives: ["d1","d2","d4"],  lighting: "natural",     time: "day",          shooting: "close-up", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=240&fit=crop&auto=format" },
  { label: "Food",       count: 67,  drives: ["d1"],             lighting: "studio",      time: "day",          shooting: "close-up", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=240&fit=crop&auto=format" },
  { label: "Travel",     count: 178, drives: ["d2","d4"],       lighting: "natural",     time: "golden-hour",  shooting: "wide",     image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=240&fit=crop&auto=format" },
  { label: "Graduation", count: 23,  drives: ["d1"],             lighting: "natural",     time: "day",          shooting: "wide",     image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=240&fit=crop&auto=format" },
  { label: "Birthday",   count: 41,  drives: ["d4"],             lighting: "studio",      time: "day",          shooting: "indoor",   image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=240&fit=crop&auto=format" },
  { label: "Landscape",  count: 95,  drives: ["d1","d4"],       lighting: "golden-hour", time: "golden-hour",  shooting: "aerial",   image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=240&fit=crop&auto=format" },
  { label: "Unknown",    count: 38,  drives: ["d2"],             lighting: "low-light",   time: "night",        shooting: "wide",     image: "" },
];

const LIGHTING_CHIPS = [
  { value: "", label: "All" },
  { value: "natural",     label: "☀️ Natural" },
  { value: "golden-hour", label: "🌅 Golden Hour" },
  { value: "overcast",    label: "☁️ Overcast" },
  { value: "studio",      label: "👎 Studio" },
  { value: "low-light",   label: "🌑 Low Light" },
  { value: "backlit",     label: "⬛ Backlit" },
];

const TIME_CHIPS = [
  { value: "",            label: "All" },
  { value: "day",         label: "☀️ Day" },
  { value: "golden-hour", label: "🌅 Golden Hour" },
  { value: "blue-hour",   label: "🌆 Blue Hour" },
  { value: "night",       label: "🌙 Night" },
];

const SHOOTING_CHIPS = [
  { value: "",         label: "All" },
  { value: "wide",     label: "🌍 Wide" },
  { value: "close-up", label: "🔍 Close-Up" },
  { value: "aerial",   label: "🚁 Aerial" },
  { value: "indoor",   label: "🏠 Indoor" },
  { value: "outdoor",  label: "🌳 Outdoor" },
  { value: "slow-mo",  label: "🎬 Slow-Mo" },
];

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="whitespace-nowrap rounded-full text-[12px] transition-all"
      style={{
        padding: "4px 12px",
        background: active ? "rgba(10,132,255,0.15)" : "rgba(235,235,245,0.06)",
        border: `1px solid ${active ? "#0A84FF" : "#38383A"}`,
        color: active ? "#0A84FF" : "rgba(235,235,245,0.6)",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

function ScenesScreen({ onNavigateSearch }: { onNavigateSearch: (query: string) => void }) {
  const [lighting, setLighting] = useState("");
  const [time, setTime] = useState("");
  const [shooting, setShooting] = useState("");
  const [hoveredDrive, setHoveredDrive] = useState<{ driveId: string; x: number; y: number } | null>(null);

  const hasFilters = lighting !== "" || time !== "" || shooting !== "";

  const filtered = useMemo(() =>
    SCENE_CATEGORIES.filter(s =>
      (lighting === "" || s.lighting === lighting) &&
      (time === "" || s.time === time) &&
      (shooting === "" || s.shooting === shooting)
    ),
    [lighting, time, shooting]
  );

  const totalScenes = SCENE_CATEGORIES.reduce((acc, s) => acc + s.count, 0);
  const filteredTotal = filtered.reduce((acc, s) => acc + s.count, 0);
  const drivesWithScenes = new Set(SCENE_CATEGORIES.flatMap(s => s.drives)).size;

  function clearFilters() {
    setLighting("");
    setTime("");
    setShooting("");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 shrink-0" style={{ borderBottom: "1px solid #38383A" }}>
        <h1 className="text-[16px] font-semibold text-white">Scenes</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "rgba(235,235,245,0.5)" }}>
          {hasFilters
            ? `${filteredTotal.toLocaleString()} matching scenes`
            : `${totalScenes.toLocaleString()} scenes across ${drivesWithScenes} drives`}
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="shrink-0 flex items-start gap-6 px-6 py-2.5 overflow-x-auto"
        style={{ background: "#2C2C2E", borderBottom: "1px solid #38383A" }}
      >
        {/* Lighting */}
        <div className="shrink-0">
          <p className="text-[11px] mb-1.5" style={{ color: "rgba(235,235,245,0.4)" }}>Lighting</p>
          <div className="flex gap-1.5">
            {LIGHTING_CHIPS.map(c => (
              <FilterChip key={c.value} label={c.label} active={lighting === c.value} onClick={() => setLighting(c.value)} />
            ))}
          </div>
        </div>

        <div className="w-px self-stretch" style={{ background: "#38383A" }} />

        {/* Time of Day */}
        <div className="shrink-0">
          <p className="text-[11px] mb-1.5" style={{ color: "rgba(235,235,245,0.4)" }}>Time of Day</p>
          <div className="flex gap-1.5">
            {TIME_CHIPS.map(c => (
              <FilterChip key={c.value} label={c.label} active={time === c.value} onClick={() => setTime(c.value)} />
            ))}
          </div>
        </div>

        <div className="w-px self-stretch" style={{ background: "#38383A" }} />

        {/* Shooting Type */}
        <div className="shrink-0">
          <p className="text-[11px] mb-1.5" style={{ color: "rgba(235,235,245,0.4)" }}>Shooting Type</p>
          <div className="flex gap-1.5">
            {SHOOTING_CHIPS.map(c => (
              <FilterChip key={c.value} label={c.label} active={shooting === c.value} onClick={() => setShooting(c.value)} />
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto self-center text-[12px] transition-colors hover:text-[#0A84FF] whitespace-nowrap shrink-0"
            style={{ color: "rgba(235,235,245,0.4)" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <LayoutGrid size={32} style={{ color: "rgba(235,235,245,0.2)" }} />
            <p className="text-[14px] font-medium" style={{ color: "rgba(235,235,245,0.4)" }}>No scenes match these filters</p>
            <button onClick={clearFilters} className="text-[12px]" style={{ color: "#0A84FF" }}>Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {filtered.map(scene => (
              <button
                key={scene.label}
                onClick={() => onNavigateSearch(scene.label)}
                className="group rounded-xl overflow-hidden text-left transition-all"
                style={{ background: "#2C2C2E", border: "1px solid #38383A" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#0A84FF")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#38383A")}
              >
                {/* Cover image */}
                <div className="overflow-hidden" style={{ height: 120, background: "#3A3A3C" }}>
                  {scene.image ? (
                    <img
                      src={scene.image}
                      alt={scene.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LayoutGrid size={28} style={{ color: "rgba(235,235,245,0.2)" }} />
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3">
                  <p className="text-[13px] font-semibold text-white">{scene.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(235,235,245,0.45)" }}>
                    {scene.count} scenes
                  </p>

                  {/* Drive dots */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {scene.drives.map(driveId => (
                      <div
                        key={driveId}
                        className="relative"
                        onMouseEnter={e => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDrive({ driveId, x: rect.left + rect.width / 2, y: rect.top });
                        }}
                        onMouseLeave={() => setHoveredDrive(null)}
                      >
                        <div className="size-2 rounded-full" style={{ background: DRIVE_COLORS[driveId] ?? "#555" }} />
                      </div>
                    ))}
                  </div>

                  {/* Visual metadata chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[scene.lighting, scene.time, scene.shooting].map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] rounded capitalize"
                        style={{ padding: "2px 6px", background: "rgba(235,235,245,0.06)", color: "rgba(235,235,245,0.5)" }}
                      >
                        {tag.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drive name tooltip */}
      {hoveredDrive && (
        <div
          className="fixed z-50 px-2 py-1 rounded-md text-[11px] font-medium pointer-events-none"
          style={{
            background: "#3A3A3C",
            color: "#fff",
            border: "1px solid #38383A",
            top: hoveredDrive.y - 28,
            left: hoveredDrive.x,
            transform: "translateX(-50%)",
          }}
        >
          {DRIVE_NAMES[hoveredDrive.driveId]}
        </div>
      )}
    </div>
  );
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      if (email === "admin@framefinder.app" && password === "password") {
        onLogin();
      } else {
        setStatus("error");
      }
    }, 1400);
  }

  return (
    <div className="size-full flex flex-col overflow-hidden" style={{ background: "#1C1C1E" }}>
      {/* macOS chrome */}
      <div
        className="flex items-center h-11 px-4 shrink-0"
        style={{ borderBottom: "1px solid #38383A" }}
      >
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="size-3 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="size-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5"
          style={{ maxWidth: 400, background: "#2C2C2E", border: "1px solid #38383A", borderRadius: 16, padding: 32 }}
        >
          {/* Branding */}
          <div className="flex flex-col items-center gap-3 mb-1">
            <div className="size-12 rounded-2xl flex items-center justify-center" style={{ background: "#0A84FF" }}>
              <Film size={22} className="text-white" />
            </div>
            <h1 className="text-[18px] font-semibold text-white">Sign in to FrameFinder</h1>
          </div>

          {/* Email */}
          <div>
            <label className="text-[12px] block mb-1.5 font-medium" style={{ color: "rgba(235,235,245,0.6)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg text-[13px] text-white outline-none transition-all"
              style={{ background: "#1C1C1E", border: `1px solid ${status === "error" ? "#FF453A" : "#38383A"}` }}
              autoFocus
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[12px] block mb-1.5 font-medium" style={{ color: "rgba(235,235,245,0.6)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setStatus("idle"); }}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 rounded-lg text-[13px] text-white outline-none transition-all"
                style={{ background: "#1C1C1E", border: `1px solid ${status === "error" ? "#FF453A" : "#38383A"}` }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(235,235,245,0.4)" }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity"
            style={{ background: "#0A84FF", opacity: status === "loading" ? 0.7 : 1 }}
          >
            {status === "loading" ? "Signing in…" : "Sign In"}
          </button>

          {/* Error */}
          {status === "error" && (
            <p className="text-[12px] text-center -mt-2" style={{ color: "#FF453A" }}>
              Invalid email or password
            </p>
          )}

          {/* Footer */}
          <p className="text-[11px] text-center" style={{ color: "rgba(235,235,245,0.3)" }}>
            {"Don't have an account? Contact your administrator."}
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Add New Drive Modal ──────────────────────────────────────────────────────

const DETECTED_DRIVES = [
  { id: "ext1", name: "WD Elements",    type: "USB",         size: "2.0 TB", path: "/Volumes/WD Elements" },
  { id: "ext2", name: "SanDisk Extreme",type: "USB",         size: "1.0 TB", path: "/Volumes/SanDisk" },
  { id: "ext3", name: "OWC Envoy Pro",  type: "Thunderbolt", size: "4.0 TB", path: "/Volumes/OWC_Envoy" },
];

function AddDriveModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [driveName, setDriveName] = useState("");

  const selectedDrive = DETECTED_DRIVES.find(d => d.id === selected);

  function handleNext() {
    if (selectedDrive) {
      setDriveName(selectedDrive.name);
      setStep(2);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col"
        style={{ width: 480, background: "#2C2C2E", border: "1px solid #38383A", borderRadius: 16 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #38383A" }}>
          <div>
            {/* Step dots */}
            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className="size-1.5 rounded-full transition-colors"
                  style={{ background: step >= s ? "#0A84FF" : "#3A3A3C" }}
                />
              ))}
              <span className="text-[11px] ml-1" style={{ color: "rgba(235,235,245,0.4)" }}>
                Step {step} of 2
              </span>
            </div>
            <h2 className="text-[15px] font-semibold text-white">
              {step === 1 ? "Select a Drive to Register" : "Name this Drive"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "rgba(235,235,245,0.4)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex-1">
          {step === 1 ? (
            <div className="space-y-2">
              {DETECTED_DRIVES.map(drive => (
                <label
                  key={drive.id}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: selected === drive.id ? "rgba(10,132,255,0.1)" : "rgba(235,235,245,0.03)",
                    border: `1px solid ${selected === drive.id ? "#0A84FF" : "#38383A"}`,
                  }}
                >
                  <input
                    type="radio"
                    name="drive"
                    value={drive.id}
                    checked={selected === drive.id}
                    onChange={() => setSelected(drive.id)}
                    className="sr-only"
                  />
                  <div
                    className="size-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(235,235,245,0.06)" }}
                  >
                    <HardDrive size={16} style={{ color: selected === drive.id ? "#0A84FF" : "rgba(235,235,245,0.4)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white">{drive.name}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: "rgba(235,235,245,0.06)", color: "rgba(235,235,245,0.5)" }}
                      >
                        {drive.type}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: "rgba(235,235,245,0.4)" }}>
                      {drive.path}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium shrink-0" style={{ color: "rgba(235,235,245,0.5)" }}>
                    {drive.size}
                  </span>
                  <div
                    className="size-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: selected === drive.id ? "#0A84FF" : "#38383A" }}
                  >
                    {selected === drive.id && (
                      <div className="size-2 rounded-full" style={{ background: "#0A84FF" }} />
                    )}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] block mb-1.5" style={{ color: "rgba(235,235,245,0.5)" }}>
                  Drive Name
                </label>
                <input
                  value={driveName}
                  onChange={e => setDriveName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] text-white outline-none"
                  style={{ background: "#1C1C1E", border: "1px solid #38383A" }}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[11px] block mb-1.5" style={{ color: "rgba(235,235,245,0.5)" }}>
                  Mount Path
                </label>
                <div
                  className="px-3 py-2.5 rounded-lg text-[12px] font-mono"
                  style={{ background: "#1C1C1E", border: "1px solid #38383A", color: "rgba(235,235,245,0.5)" }}
                >
                  {selectedDrive?.path}
                </div>
              </div>
              <div>
                <label className="text-[11px] block mb-1.5" style={{ color: "rgba(235,235,245,0.5)" }}>
                  Capacity
                </label>
                <div
                  className="px-3 py-2.5 rounded-lg text-[12px]"
                  style={{ background: "#1C1C1E", border: "1px solid #38383A", color: "rgba(235,235,245,0.5)" }}
                >
                  {selectedDrive?.size}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid #38383A" }}
        >
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "rgba(235,235,245,0.6)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!selected}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity"
                style={{
                  background: selected ? "#0A84FF" : "#3A3A3C",
                  color: selected ? "#fff" : "rgba(235,235,245,0.3)",
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "rgba(235,235,245,0.6)" }}
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: "#0A84FF" }}
              >
                Register & Start Indexing
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [searchPrefill, setSearchPrefill] = useState("");

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  function navigateToSearch(query: string) {
    setSearchPrefill(query);
    setScreen("search");
  }

  const screenTitles: Record<Screen, string> = {
    dashboard: "FrameFinder — Drive Manager",
    search: "FrameFinder — Smart Search",
    scenes: "FrameFinder — Scenes",
    people: "FrameFinder — People",
    reviews: "FrameFinder — Pending Reviews",
    settings: "FrameFinder — Settings",
  };

  const screens: Record<Screen, JSX.Element> = {
    dashboard: <DashboardScreen />,
    search: <SearchScreen prefill={searchPrefill} onClear={() => setSearchPrefill("")} />,
    scenes: <ScenesScreen onNavigateSearch={navigateToSearch} />,
    people: <PeopleScreen />,
    reviews: <ReviewsScreen />,
    settings: <SettingsScreen />,
  };

  return (
    <div
      className="size-full flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif", background: "#1C1C1E" }}
    >
      {/* macOS window chrome */}
      <WindowChrome title={screenTitles[screen]} />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={screen} onNav={setScreen} />

        {/* Content area */}
        <div className="flex-1 overflow-hidden" style={{ background: "#1C1C1E" }}>
          {screens[screen]}
        </div>
      </div>

      {/* Scrollbar hide */}
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(235,235,245,0.15); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(235,235,245,0.3); }
      `}</style>
    </div>
  );
}
