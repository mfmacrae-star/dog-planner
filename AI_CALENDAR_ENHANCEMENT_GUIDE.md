# AI Calendar Query Enhancement - Implementation Guide

## What We've Built (Frontend Changes)

### 1. Enhanced AskAI Component (`/tmp/dog-planner/src/app/components/AskAI.tsx`)

**Changes Made:**
- ✅ Added `userEmail` prop to AskAI component
- ✅ Updated welcome message to mention calendar queries
- ✅ Added calendar-related suggested prompts:
  - "What appointments do I have this week?"
  - "When is my next vet appointment?"
- ✅ Implemented calendar question detection using keywords
- ✅ Fetches calendar events when question is calendar-related
- ✅ Passes calendar data to AI as context

**How It Works:**
1. User asks a question (e.g., "What appointments do I have on December 9th?")
2. Frontend detects calendar keywords: appointment, calendar, schedule, event, meeting, vet, grooming, plan, free, busy, available, when
3. If detected AND user has email, fetches calendar events from endpoint
4. Sends both the question + calendar data to AI
5. AI responds with actual appointment information

### 2. Updated MonthlyCalendar Component
- ✅ Now passes `userEmail` prop to AskAI component

---

## What Needs Backend Support

### Option A: Use Existing Supabase Database (Recommended)

The frontend is trying to fetch calendar events from:
```
https://${projectId}.supabase.co/functions/v1/make-server-7edd5186/calendar-events/${email}
```

**You need to add this endpoint to your Supabase Edge Function:**

```typescript
// In your Supabase Edge Function (make-server-7edd5186)
// Add this route:

if (url.pathname.startsWith('/calendar-events/')) {
  const email = decodeURIComponent(url.pathname.split('/calendar-events/')[1]);
  
  // Fetch from calendar_events table (once it exists)
  const { data, error } = await supabaseClient
    .from('calendar_events')
    .select('*')
    .eq('email', email)
    .order('date', { ascending: true });
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(data || []), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
```

**Also update your AI endpoint to handle calendar context:**

```typescript
// In the ask-ai endpoint handler:
const { messages, context } = await req.json();
const { breed, month, date, calendarEvents } = context;

let systemPrompt = `You are a helpful assistant for a Dog Day Planner app. 
The user has a ${breed} and it's currently ${month} ${date}.`;

// Add calendar context if provided
if (calendarEvents && calendarEvents.length > 0) {
  systemPrompt += `\n\nThe user's calendar contains the following appointments:\n`;
  calendarEvents.forEach((event) => {
    systemPrompt += `- ${event.date}: ${event.title}${event.description ? ' (' + event.description + ')' : ''}\n`;
  });
  systemPrompt += `\nWhen answering questions about appointments, use this information.`;
}

// Continue with OpenAI call...
```

---

## Option B: Use Vercel API Endpoint (If Google Calendar Setup Complete)

If you've completed the Google Calendar setup with Vercel functions, you can also create:

**File:** `/tmp/dog-planner/api/calendar-events.py`

```python
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_utils'))

from supabase_client import get_supabase

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse email from URL
            parsed = urlparse(self.path)
            email = parsed.path.split('/')[-1]
            
            if not email:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Email required'}).encode())
                return
            
            # Fetch calendar events
            supabase = get_supabase()
            result = supabase.table('calendar_events').select('*').eq('email', email).order('date').execute()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result.data or []).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
```

Then update AskAI.tsx to call `/api/calendar-events/${email}` instead of the Supabase function.

---

## Testing the Feature

### Prerequisites:
1. ✅ Google Calendar integration setup complete
2. ✅ `calendar_events` table exists in Supabase
3. ✅ User has some calendar events synced
4. ✅ Backend endpoint for fetching calendar events is implemented

### Test Cases:

**1. Calendar Questions:**
- "What appointments do I have this week?"
- "What's on my schedule for December 9th?"
- "When is my next vet appointment?"
- "Am I free on Friday?"
- "Show me all my appointments"

**Expected:** AI responds with actual appointment data from the database

**2. Dog Questions (Still Working):**
- "Tell me about Golden Retrievers"
- "What exercise does a Labrador need?"
- "Best activities for March"

**Expected:** AI responds with dog breed information (no calendar data needed)

**3. Mixed Questions:**
- "Should I take my Labrador to the vet this week?"

**Expected:** AI considers both dog breed info AND user's calendar appointments

---

## Current Status

### ✅ Completed (Frontend):
- AI component enhanced to detect calendar questions
- Calendar keyword detection implemented
- Calendar data fetching logic added
- Suggested prompts updated
- User email passed through component tree

### ⏳ Pending (Backend):
- Add `/calendar-events/{email}` endpoint to Supabase Edge Function OR create Vercel API endpoint
- Update AI Edge Function to handle `calendarEvents` context
- Ensure OpenAI prompt includes calendar data when provided

### 🧪 Testing Needed:
- Test calendar question detection
- Test AI responses with calendar data
- Verify dog questions still work
- Test edge cases (no calendar data, malformed queries, etc.)

---

## Quick Implementation Steps

### If Using Supabase Edge Function (Recommended):

1. Open your Supabase Edge Function editor
2. Add the calendar-events endpoint code (see Option A above)
3. Update the ask-ai endpoint to handle calendar context
4. Deploy the function
5. Test with the frontend

### If Using Vercel Functions:

1. Create `/tmp/dog-planner/api/calendar-events.py`
2. Update AskAI.tsx fetch URL to use `/api/calendar-events`
3. Push to GitHub
4. Test

---

## Next Steps

Once the backend is updated:
1. Complete Google Calendar setup (if not done)
2. Sync some test events
3. Test AI calendar queries
4. Refine AI prompts if needed
5. Add more sophisticated date parsing (e.g., "this week", "next month", etc.)

---

## Files Modified

- `/tmp/dog-planner/src/app/components/AskAI.tsx` ✅
- `/tmp/dog-planner/src/app/components/MonthlyCalendar.tsx` ✅
- Supabase Edge Function (needs update) ⏳

## Credits Used

- Frontend AI enhancement: ~10-15 credits
- Total remaining after this feature: Check your dashboard

---

**The frontend is ready! Once you add the backend endpoint, users will be able to ask calendar questions!** 🎉
