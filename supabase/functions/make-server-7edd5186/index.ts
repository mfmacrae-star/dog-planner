import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-7edd5186/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION =====

app.post("/make-server-7edd5186/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Missing email or password" }, 400);
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "" },
      email_confirm: true
    });
    if (error) {
      console.log(`Error creating user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    return c.json({ success: true, user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    console.log(`Error in signup endpoint: ${error}`);
    return c.json({ error: `Failed to create user: ${error}` }, 500);
  }
});

app.get("/make-server-7edd5186/debug/env-check", (c) => {
  return c.json({
    googleClientIdLoaded: !!GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 0,
    googleClientSecretLoaded: !!GOOGLE_CLIENT_SECRET && GOOGLE_CLIENT_SECRET.length > 0,
    clientIdPrefix: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 20) + "..." : "NOT_LOADED",
    anthropicKeyLoaded: !!ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.length > 0,
    anthropicKeyPrefix: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 7) + "..." : "NOT_LOADED"
  });
});

app.get("/make-server-7edd5186/debug/redirect-uri", (c) => {
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const baseUrl = c.req.url.split('/debug/redirect-uri')[0];
  const redirectUri = `${baseUrl}/google/auth/callback?apikey=${anonKey}`;
  return c.html(`<!DOCTYPE html><html><head><title>Google OAuth Redirect URI</title></head><body style="font-family:system-ui;max-width:800px;margin:50px auto;padding:20px"><div style="background:white;padding:30px;border-radius:12px"><h1>Redirect URI</h1><div style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:8px;padding:15px;font-family:monospace;word-break:break-all">${redirectUri}</div></div></body></html>`);
});

// ===== CALENDAR ENTRIES =====

// Save calendar entry - mirrors gratitude exactly, no email in key
app.post("/make-server-7edd5186/calendar/entry", async (c) => {
  try {
    const { year, month, day, content } = await c.req.json();
    if (!year || !month || !day) {
      return c.json({ error: "Missing required fields: year, month, day" }, 400);
    }
    const key = `calendar:${year}-${month}-${day}`;
    await kv.set(key, content || "");
    return c.json({ success: true, key });
  } catch (error) {
    console.log(`Error saving calendar entry: ${error}`);
    return c.json({ error: `Failed to save calendar entry: ${error}` }, 500);
  }
});

// Get calendar entries for a month - mirrors gratitude, individual kv.get per day
app.get("/make-server-7edd5186/calendar/month/:year/:month", async (c) => {
  try {
    const year = c.req.param("year");
    const month = c.req.param("month");
    if (!year || !month) {
      return c.json({ error: "Missing year or month parameter" }, 400);
    }
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const entriesMap: { [key: number]: string } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `calendar:${year}-${month}-${day}`;
      const value = await kv.get(key);
      if (value) entriesMap[day] = value as string;
    }
    return c.json({ entries: entriesMap });
  } catch (error) {
    console.log(`Error loading calendar entries: ${error}`);
    return c.json({ error: `Failed to load calendar entries: ${error}` }, 500);
  }
});


// ===== GRATITUDE ENTRIES =====

app.post("/make-server-7edd5186/gratitude/entry", async (c) => {
  try {
    const { year, month, day, content } = await c.req.json();
    if (!year || !month || !day) {
      return c.json({ error: "Missing required fields: year, month, day" }, 400);
    }
    const key = `gratitude:${year}-${month}-${day}`;
    await kv.set(key, content || "");
    return c.json({ success: true, key });
  } catch (error) {
    console.log(`Error saving gratitude entry: ${error}`);
    return c.json({ error: `Failed to save gratitude entry: ${error}` }, 500);
  }
});

app.get("/make-server-7edd5186/gratitude/:year/:month/:day", async (c) => {
  try {
    const year = c.req.param("year");
    const month = c.req.param("month");
    const day = c.req.param("day");
    if (!year || !month || !day) {
      return c.json({ error: "Missing date parameters" }, 400);
    }
    const key = `gratitude:${year}-${month}-${day}`;
    const content = await kv.get(key);
    return c.json({ content: content || "" });
  } catch (error) {
    console.log(`Error loading gratitude entry: ${error}`);
    return c.json({ error: `Failed to load gratitude entry: ${error}` }, 500);
  }
});

// ===== GOOGLE CALENDAR INTEGRATION =====

app.post("/make-server-7edd5186/google/auth/init", async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) {
      return c.json({ error: "Missing email" }, 400);
    }
    const state = crypto.randomUUID();
    await kv.set(`google:oauth:state:${state}`, JSON.stringify({ email, createdAt: Date.now() }));
    const redirectUri = "https://zkdqvxaihllzqtnuejqa.supabase.co/functions/v1/make-server-7edd5186/google/auth/callback?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZHF2eGFpaGxsenF0bnVlanFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjkwNjMsImV4cCI6MjA4MTY0NTA2M30.T_SA17QrITykMi4uKSEnLFXdEZ572rM8ghDFEM-T1BA";
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    return c.json({ authUrl: authUrl.toString(), state, redirectUri });
  } catch (error) {
    console.log(`Error initializing Google OAuth: ${error}`);
    return c.json({ error: `Failed to initialize OAuth: ${error}` }, 500);
  }
});

app.get("/make-server-7edd5186/google/auth/callback", async (c) => {
  try {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return c.html(`<!DOCTYPE html><html><body><h1>Configuration Error</h1><button onclick="window.close()">Close</button></body></html>`);
    }
    if (error) {
      return c.html(`<!DOCTYPE html><html><body><h1>Connection Failed: ${error}</h1><button onclick="window.close()">Close</button></body></html>`);
    }
    if (!code || !state) {
      return c.html(`<!DOCTYPE html><html><body><h1>Invalid Request</h1><button onclick="window.close()">Close</button></body></html>`);
    }
    let email;
    try {
      const stateData = await kv.get(`google:oauth:state:${state}`);
      if (!stateData) {
        return c.html(`<!DOCTYPE html><html><body><h1>Session Expired</h1><button onclick="window.close()">Close</button></body></html>`);
      }
      const parsed = JSON.parse(stateData as string);
      email = parsed.email;
    } catch (kvError) {
      console.log(`Error accessing KV store: ${kvError}`);
      return c.html(`<!DOCTYPE html><html><body><h1>Database Error</h1><button onclick="window.close()">Close</button></body></html>`);
    }
    const redirectUri = "https://zkdqvxaihllzqtnuejqa.supabase.co/functions/v1/make-server-7edd5186/google/auth/callback?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZHF2eGFpaGxsenF0bnVlanFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjkwNjMsImV4cCI6MjA4MTY0NTA2M30.T_SA17QrITykMi4uKSEnLFXdEZ572rM8ghDFEM-T1BA";
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: "authorization_code" }).toString(),
    });
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return c.html(`<!DOCTYPE html><html><body><h1>Connection Failed</h1><p>${errorText}</p><button onclick="window.close()">Close</button></body></html>`);
    }
    const tokenData = await tokenResponse.json();
    await kv.set(`google:tokens:${email}`, JSON.stringify({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      connectedAt: new Date().toISOString()
    }));
    await kv.del(`google:oauth:state:${state}`);
    return c.html(`<!DOCTYPE html><html><head><title>Calendar Connected!</title></head><body style="font-family:system-ui;text-align:center;padding:40px"><h1 style="color:#059669">✅ Google Calendar Connected!</h1><p>This window will close in <span id="c">3</span> seconds...</p><button onclick="closeWindow()" style="padding:10px 20px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer">Close Now</button><script>let s=3;const el=document.getElementById('c');function closeWindow(){try{if(window.opener&&!window.opener.closed)window.opener.postMessage({type:'calendar-connected',email:'${email.replace(/'/g, "\\'")}'},'*')}catch(e){}window.close()}const t=setInterval(()=>{s--;if(el)el.textContent=s;if(s<=0){clearInterval(t);closeWindow()}},1000)</script></body></html>`);
  } catch (error) {
    console.log(`Error in OAuth callback: ${error}`);
    return c.json({ error: `OAuth callback failed: ${error}` }, 500);
  }
});

app.get("/make-server-7edd5186/google/status/:email", async (c) => {
  try {
    const email = c.req.param("email");
    if (!email) return c.json({ error: "Missing email parameter" }, 400);
    const tokenData = await kv.get(`google:tokens:${email}`);
    if (!tokenData) return c.json({ connected: false });
    const parsed = JSON.parse(tokenData as string);
    return c.json({ connected: true, provider: 'google', connectedAt: parsed.connectedAt });
  } catch (error) {
    console.log(`Error checking Google Calendar status: ${error}`);
    return c.json({ error: `Failed to check calendar status: ${error}` }, 500);
  }
});

async function getValidAccessToken(email: string): Promise<string | null> {
  const tokenData = await kv.get(`google:tokens:${email}`);
  if (!tokenData) return null;
  const tokens = JSON.parse(tokenData as string);
  if (tokens.expiresAt > Date.now() + 60000) return tokens.accessToken;
  if (!tokens.refreshToken) return null;
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, refresh_token: tokens.refreshToken, grant_type: "refresh_token" }).toString(),
    });
    if (!response.ok) { console.log(`Token refresh failed: ${await response.text()}`); return null; }
    const newTokens = await response.json();
    await kv.set(`google:tokens:${email}`, JSON.stringify({
      accessToken: newTokens.access_token,
      refreshToken: tokens.refreshToken,
      expiresAt: Date.now() + (newTokens.expires_in * 1000),
      connectedAt: tokens.connectedAt,
    }));
    return newTokens.access_token;
  } catch (error) {
    console.log(`Error refreshing token: ${error}`);
    return null;
  }
}

app.get("/make-server-7edd5186/google/events/:email/:year/:month", async (c) => {
  try {
    const email = c.req.param("email");
    const year = c.req.param("year");
    const month = c.req.param("month");
    if (!email || !year || !month) return c.json({ error: "Missing required parameters" }, 400);
    const accessToken = await getValidAccessToken(email);
    if (!accessToken) return c.json({ error: "Calendar not connected or token expired" }, 400);
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    url.searchParams.set("timeMin", startDate.toISOString());
    url.searchParams.set("timeMax", endDate.toISOString());
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    const response = await fetch(url.toString(), {
      headers: { "Authorization": `Bearer ${accessToken}`, "Accept": "application/json" },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return c.json({ error: `Failed to fetch events: ${errorText}` }, response.status);
    }
    const data = await response.json();
    const eventsByDay: { [key: number]: Array<{ title: string; time: string; id: string }> } = {};
    if (data.items && Array.isArray(data.items)) {
      for (const event of data.items) {
        const startStr = event.start?.dateTime || event.start?.date;
        if (!startStr) continue;
        const eventDate = new Date(startStr);
        const day = event.start?.dateTime
          ? parseInt(eventDate.toLocaleString('en-US', { day: 'numeric', timeZone: 'America/New_York' }))
          : eventDate.getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        const startTime = event.start?.dateTime
          ? eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' })
          : "All day";
        eventsByDay[day].push({ id: event.id, title: event.summary || "(No title)", time: startTime });
      }
    }
    return c.json({ events: eventsByDay });
  } catch (error) {
    console.log(`Error fetching Google Calendar events: ${error}`);
    return c.json({ error: `Failed to fetch calendar events: ${error}` }, 500);
  }
});

app.delete("/make-server-7edd5186/google/disconnect/:email", async (c) => {
  try {
    const email = c.req.param("email");
    if (!email) return c.json({ error: "Missing email parameter" }, 400);
    await kv.del(`google:tokens:${email}`);
    return c.json({ success: true, message: "Calendar disconnected" });
  } catch (error) {
    console.log(`Error disconnecting calendar: ${error}`);
    return c.json({ error: `Failed to disconnect calendar: ${error}` }, 500);
  }
});

app.post("/make-server-7edd5186/google/sync-entry", async (c) => {
  try {
    const { email, year, month, day, title, time } = await c.req.json();
    if (!email || !year || !month || !day || !title) return c.json({ error: "Missing required fields" }, 400);
    const accessToken = await getValidAccessToken(email);
    if (!accessToken) return c.json({ error: "Calendar not connected or token expired" }, 400);
    let event;
    if (time && time.trim() !== "") {
      const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3]?.toUpperCase();
        if (ampm) { if (ampm === 'PM' && hours !== 12) hours += 12; if (ampm === 'AM' && hours === 12) hours = 0; }
        const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        event = { summary: title, description: "Synced from Digital Dog Day Planner", start: { dateTime: startDateTime.toISOString(), timeZone: 'America/New_York' }, end: { dateTime: endDateTime.toISOString(), timeZone: 'America/New_York' } };
      } else {
        const eventDateStr = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString().split('T')[0];
        event = { summary: title, description: "Synced from Digital Dog Day Planner", start: { date: eventDateStr }, end: { date: eventDateStr } };
      }
    } else {
      const eventDateStr = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString().split('T')[0];
      event = { summary: title, description: "Synced from Digital Dog Day Planner", start: { date: eventDateStr }, end: { date: eventDateStr } };
    }
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return c.json({ error: `Failed to create event: ${errorText}` }, response.status);
    }
    const createdEvent = await response.json();
    return c.json({ success: true, eventId: createdEvent.id, message: "Event synced to Google Calendar" });
  } catch (error) {
    console.log(`Error syncing entry to Google Calendar: ${error}`);
    return c.json({ error: `Failed to sync entry: ${error}` }, 500);
  }
});

// ===== AI CHAT =====

app.post("/make-server-7edd5186/ask-ai", async (c) => {
  try {
    if (!ANTHROPIC_API_KEY) return c.json({ error: "Anthropic API key not configured." }, 500);
    const { messages, context } = await c.req.json();
    if (!messages || !Array.isArray(messages)) return c.json({ error: "Missing or invalid messages array" }, 400);

    let systemPrompt = `You are a helpful AI assistant for a Dog Breed Calendar & Planner application. Current context: breed: ${context?.breed || "Unknown"}, month: ${context?.month || "Unknown"}, date: ${context?.date || "Unknown"}. Be friendly, concise, and helpful.`;

    if (context?.calendarEvents && Array.isArray(context.calendarEvents) && context.calendarEvents.length > 0) {
      systemPrompt += `\n\nThe user's calendar contains the following appointments:\n`;
      context.calendarEvents.forEach((event: any) => {
        systemPrompt += `- ${event.date}: ${event.title}${event.description ? ' (' + event.description + ')' : ''}\n`;
      });
      systemPrompt += `\nWhen answering questions about appointments, use this information.`;
    }

    // Anthropic requires messages to alternate user/assistant starting with user — strip any leading assistant messages
    let anthropicMessages: { role: string; content: string }[] = messages
      .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
      .map((msg: any) => ({ role: msg.role, content: msg.content }));
    while (anthropicMessages.length > 0 && anthropicMessages[0].role === "assistant") {
      anthropicMessages = anthropicMessages.slice(1);
    }

    if (anthropicMessages.length === 0) return c.json({ error: "No user messages found." }, 400);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return c.json({ error: `Anthropic API request failed: ${response.status} - ${errorText}` }, response.status);
    }
    const data = await response.json();
    if (!data.content || !data.content[0] || !data.content[0].text) return c.json({ error: "Unexpected response format from Anthropic" }, 500);
    return c.json({ response: data.content[0].text });
  } catch (error) {
    console.log(`Error in AI chat endpoint: ${error}`);
    return c.json({ error: `AI chat request failed: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);