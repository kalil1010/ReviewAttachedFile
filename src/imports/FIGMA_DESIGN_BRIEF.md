# دليل التصميم لـ Figma (UI/UX Design Brief)
**المشروع:** FrameFinder
**المنصة:** macOS Desktop Application
**الإصدار:** v1.0

---

## 1. هوية التصميم (Design Identity)

### الأسلوب العام
- **Native macOS Feel** — يشبه تطبيقات Apple الأصلية (Finder, Photos, Final Cut Pro)
- **Dark Mode أساسي** مع دعم Light Mode
- **Dense & Functional** — مش تطبيق ويب، الـ UI لازم يستغل مساحة الشاشة بكفاءة

### الألوان
```
Background Primary:    #1C1C1E   (macOS dark background)
Background Secondary:  #2C2C2E   (cards & sidebars)
Background Tertiary:   #3A3A3C   (hover states)
Accent (Blue):         #0A84FF   (primary actions - macOS blue)
Accent (Green):        #32D74B   (confirm / success)
Accent (Red):          #FF453A   (reject / danger)
Accent (Orange):       #FF9F0A   (warning / pending)
Text Primary:          #FFFFFF
Text Secondary:        #EBEBF5   (60% opacity)
Text Tertiary:         #EBEBF5   (30% opacity)
Separator:             #38383A
```

### التايبوغرافي
```
Font Family:   SF Pro Display / SF Pro Text (macOS system font)
               Fallback: Inter

Headings:      SF Pro Display - Bold
Body:          SF Pro Text - Regular
Captions:      SF Pro Text - Regular (11-12px)
Monospace:     SF Mono (للأكواد أو الـ UUIDs)
```

### الأيقونات
- **SF Symbols** (Apple's native icon system) — الأولوية
- Fallback: Lucide Icons

---

## 2. الشاشات المطلوبة (Screens)

### الشاشة 1: Dashboard (إدارة الأقراص)
**الوظيفة:** الشاشة الرئيسية — عرض كل الأقراص المسجّلة وحالتها.

**مكونات الشاشة:**
- **Sidebar (يسار):** قائمة تنقل بين الشاشات (Dashboard, Search, People, Reviews)
- **Header:** اسم التطبيق + زر "Add New Drive"
- **Grid of Drive Cards:** كل كارد يحتوي على:
  - أيقونة هارد + اسم القرص
  - Status Badge: `Connected` (أخضر) / `Disconnected` (رمادي) / `Indexing...` (أزرق + progress)
  - عدد الفيديوهات
  - تاريخ آخر فهرسة
  - زر QR Code صغير
  - زر "Index Now"
- **Empty State:** لما مافيش أقراص مسجّلة بعد

**ملاحظات UX:**
- الكارد بتاع القرص المتصل حالياً يكون highlighted بإطار أزرق
- Progress Bar واضحة أثناء الفهرسة مع نسبة مئوية
- QR Code يظهر في Modal/Popover عند الضغط عليه

---

### الشاشة 2: Smart Search (البحث الذكي)
**الوظيفة:** واجهة البحث بالنص أو الصورة في كل الفيديوهات.

**مكونات الشاشة:**
- **Search Bar كبيرة** في الأعلى مع placeholder: "Search scenes, people, moments..."
- **Toggle:** نص / صورة (لتبديل طريقة البحث)
- **Offline Indicator:** شريط صغير يظهر عند انقطاع الإنترنت — "Offline mode: text search only"
- **Results Grid:** كل نتيجة تحتوي على:
  - Thumbnail للـ Keyframe
  - اسم الفيديو + اسم الهارد
  - Timestamp (قابل للنسخ)
  - Similarity Score (%)
- **Empty State / Loading State**

**ملاحظات UX:**
- النتائج تظهر فورياً أثناء الكتابة (Debounce 300ms)
- Hover على النتيجة يظهر زر "Locate Drive" لو الهارد غير متصل

---

### الشاشة 3: People (إدارة الأشخاص)
**الوظيفة:** عرض كل الأشخاص المعروفين والمجهولين.

**مكونات الشاشة:**
- **Tabs:** All / Known / Unknown
- **Grid of Person Cards:** كل كارد يحتوي على:
  - Profile Image (وجه)
  - الاسم أو "Unknown #12"
  - عدد الظهورات في الفيديوهات
  - زر تعديل الاسم (inline edit)
- **Merge Button:** لدمج بروفايلين لنفس الشخص

---

### الشاشة 4: Pending Reviews (مراجعة الوجوه)
**الوظيفة:** الشاشة الأهم للـ Active Learning — مراجعة الوجوه المعلقة.

**Layout:** Split View أفقي

**الجزء الأيسر (قائمة المعلقة):**
- عدد الوجوه المعلقة (Badge)
- قائمة scrollable من الوجوه المعلقة
- كل عنصر: صورة الوجه + confidence score + اسم الشخص المقترح
- الـ item المحدد يكون highlighted

**الجزء الأيمن (تفاصيل المراجعة):**
- **صورة الوجه المكتشف** (كبيرة، واضحة)
- **صورة البروفايل الأصلي** بجانبها
- **Confidence Score** واضح مع لون حسب النطاق
- **Confidence Slider** قابل للتعديل من الإعدادات
- **زر Confirm (Y)** — أخضر كبير
- **زر Reject (N)** — أحمر كبير
- **زر Skip** — رمادي صغير
- **Keyboard Shortcut Hints:** `Y` / `N` / `→`

**ملاحظات UX:**
- بعد كل قرار، ينتقل تلقائياً للعنصر التالي
- شريط Progress في الأعلى: "12 of 47 reviewed"
- "All Done" state جميل لما تخلص كل المراجعات

---

### الشاشة 5: Settings (الإعدادات)
**مكونات الشاشة:**
- **Server Configuration:** حقل URL السيرفر + زر Test Connection
- **Confidence Thresholds:** Slider مزدوج لضبط النطاقات (Auto-Confirm / Review / Auto-Reject)
- **Indexing Settings:** كثافة استخراج الـ Keyframes (Low/Medium/High)
- **Storage Info:** حجم قاعدة البيانات + زر Vacuum
- **About:** إصدار التطبيق

---

## 3. مكونات مشتركة (Shared Components)

| المكوّن | الوصف |
| :--- | :--- |
| `Sidebar` | تنقل رئيسي دائم على اليسار، عرض 220px |
| `StatusBadge` | Connected / Disconnected / Indexing / Pending |
| `DriveCard` | كارد القرص الخارجي |
| `PersonCard` | كارد الشخص في People screen |
| `SearchResultCard` | نتيجة البحث (Keyframe + metadata) |
| `ConfidenceSlider` | Slider مزدوج لضبط النطاقات |
| `QRModal` | Modal يعرض QR Code للطباعة |
| `EmptyState` | حالة الشاشة الفارغة (icon + message + CTA) |
| `OfflineBanner` | شريط تحذير انقطاع الإنترنت |
| `ProgressBar` | شريط التقدم أثناء الفهرسة |

---

## 4. التدفق العام (User Flow)

```
FrameFinder Launch
    │
    ├──► Dashboard (لا يوجد أقراص) → "Add Drive" → Indexing → Done
    │
    ├──► Dashboard (أقراص موجودة) → اختيار قرص → عرض تفاصيله
    │
    ├──► Search → كتابة نص أو رفع صورة → النتائج → Locate Drive
    │
    ├──► People → عرض الأشخاص → تعديل الأسماء → Merge
    │
    ├──► Reviews → مراجعة Y/N → تحديث قاعدة البيانات
    │
    └──► Settings → ضبط السيرفر + Thresholds
```

---

## 5. الـ Prototype المطلوب في Figma

### الأولوية العالية (Priority 1)
- [ ] Dashboard — Drive Cards + Status Badges
- [ ] Pending Reviews — Split View كامل مع الأزرار

### الأولوية المتوسطة (Priority 2)
- [ ] Smart Search — Search Bar + Results Grid
- [ ] People — Grid + Unknown/Known tabs

### الأولوية المنخفضة (Priority 3)
- [ ] Settings
- [ ] QR Modal
- [ ] Empty States & Loading States

---

## 6. ملاحظات للمصمم

1. **لا تستخدم Web Patterns** — مش موقع ويب. تجنب hero sections, full-width banners, centered layouts.
2. **الكثافة مهمة** — المستخدم يتعامل مع مئات الملفات، اعرض أكبر قدر من المعلومات.
3. **الـ Sidebar ثابتة** على اليسار دائماً — مش hamburger menu.
4. **اختبر Dark Mode أولاً** — هو الـ Default.
5. **الـ macOS Window Controls** (أحمر/أصفر/أخضر) لازم تكون موجودة في كل frame.
6. **Keyboard-first** في شاشة Reviews — الأزرار تعكس الـ shortcuts بوضوح.
