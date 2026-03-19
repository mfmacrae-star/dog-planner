DOG PLANNER SESSION — March 18, 2026 (Evening)
===============================================

COMPLETED EARLIER (March 17)
------------------------------
1. FIXED: Events/green bubbles disappearing on refresh ✅
   - Root cause: getByPrefix() in kv_store.tsx stripping keys
   - Fix: line 86 changed to `return data ?? [];`
   - Deployed via Supabase Edge Functions

2. Password eye icon ✅
3. Gratitude section moved above grid ✅

IN PROGRESS: Month 3 (Old English Sheepdog) — photo border issue
------------------------------------------------------------------
PROBLEM: All 5 OES photos were Imgur PNGs with white borders baked in.

ATTEMPTS SO FAR:
1. Tried Pexels 156961 → turned out to be a screenshot with browser chrome visible ❌
2. Tried Wikimedia Commons JPEGs → Wikimedia blocks hotlinking, showed blank ❌
3. Currently committed: Wikimedia URLs — showing NO image at all for days 1-28

CURRENT STATE OF dogBreedPhotos.ts (month 3):
  Week 1: https://upload.wikimedia.org/... (BROKEN - hotlink blocked)
  Week 2: https://upload.wikimedia.org/... (BROKEN - hotlink blocked)
  Week 3: https://upload.wikimedia.org/... (BROKEN - hotlink blocked)
  Week 4: https://upload.wikimedia.org/... (BROKEN - hotlink blocked)
  Week 5: https://images.pexels.com/photos/156961/... (shows screenshot with browser chrome)

PICK UP HERE TOMORROW
---------------------
BEST APPROACH: Get the OES image URL that's already working in the Breed Book.

Steps:
1. Open dog-planner-one.vercel.app
2. Click "Breed Book" in the top nav
3. Navigate to March (Old English Sheepdog)
4. Press F12 → Network tab → click "Img" filter
5. The OES photo will appear in the list — click it and copy the URL
6. That URL is already hotlink-friendly since it loads in the app
7. Paste it here and I'll update all 5 weeks with that URL

ALTERNATIVE if above doesn't work:
- Upload your own OES photo to Imgur and use that direct URL
- Or search pexels.com manually, find an OES photo, right-click the image
  and copy image URL (should start with images.pexels.com)

SOURCES CONFIRMED WORKING (hotlink-friendly):
✅ images.pexels.com — works reliably
✅ images.unsplash.com — works reliably
✅ i.imgur.com — works BUT .png files often have white borders baked in
❌ upload.wikimedia.org — blocks hotlinking
❌ plus.unsplash.com/premium_photo — sometimes blocked

OTHER MONTHS STATUS
--------------------
All other months (1,2,4,5,6,7,8,9,10,11,12) appear to be working correctly
with clean Pexels/Unsplash JPEGs. Only Month 3 (OES) needs fixing.

HOW-TO REMINDERS
-----------------
GitHub edits:
- Go to github.dev/mfmacrae-star/dog-planner
- Ctrl+P → type dogBreed → open file
- Edit → Ctrl+S → Source Control icon → commit message → Ctrl+Enter
- Vercel auto-deploys in ~2 min

Supabase Edge Function edits:
- supabase.com → Digital Dog Calendar → Edge Functions
  → make-server-7edd5186 → Code tab → edit → Deploy updates