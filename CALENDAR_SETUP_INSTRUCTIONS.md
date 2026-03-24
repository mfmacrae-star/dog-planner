# Google Calendar Integration Setup Instructions

## 🚀 Quick Setup Guide

### 1. **Setup Supabase Database Tables**

Run the SQL commands in `supabase-setup.sql` in your Supabase SQL Editor:
1. Go to https://supabase.com/dashboard
2. Select your project (zkdqvxaihllzqtnuejqa)
3. Click "SQL Editor" in the left sidebar
4. Copy and paste the contents of `supabase-setup.sql`
5. Click "Run" to create the tables

### 2. **Configure Vercel Environment Variables**

Add these environment variables in your Vercel project settings:

1. Go to https://vercel.com/dashboard
2. Select your `dog-planner` project
3. Go to Settings → Environment Variables
4. Add the following:

```
GOOGLE_CLIENT_ID=983209214102-fo52m0beq2seo6r80jbha4o4pv79ihdj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://dog-planner-one.vercel.app/api/google-auth-callback
```

**Important:** Add these variables to **all environments** (Production, Preview, Development)

### 3. **Update Google OAuth Redirect URI**

1. Go to https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add this to "Authorized redirect URIs":
   ```
   https://dog-planner-one.vercel.app/api/google-auth-callback
   ```
4. Click "Save"

### 4. **Deploy to Vercel**

Push your changes to GitHub:
```bash
cd /tmp/dog-planner
git add .
git commit -m "Add Google Calendar two-way sync integration"
git push origin main
```

Vercel will automatically deploy!

### 5. **Test the Integration**

1. Go to https://dog-planner-one.vercel.app
2. Log in with: mfmacrae@gmail.com / Sadie150
3. Click "Connect Calendar"
4. Authorize Google Calendar access
5. Click "Sync Now" to test two-way sync

## 🎯 How It Works

### For End Users:
1. **Connect** - One-time Google OAuth authentication
2. **Sync** - Click "Sync Now" button to sync events both ways
3. **Automatic** - Events created in Dog Planner appear in Google Calendar
4. **Seamless** - No re-authentication needed

### Technical Flow:
- **OAuth**: `/api/google-auth-init` → Google → `/api/google-auth-callback`
- **Status**: `/api/google-status` checks connection
- **Sync**: `/api/google-sync` performs two-way synchronization
- **Disconnect**: `/api/google-disconnect` removes connection

### Database Tables:
- `user_calendar_tokens` - Stores OAuth tokens (encrypted by Supabase)
- `calendar_events` - Stores Dog Planner events with Google Calendar IDs

## 🔧 Troubleshooting

### "Calendar not connected" error
- Check that Supabase tables are created
- Verify environment variables are set in Vercel
- Try disconnecting and reconnecting

### OAuth redirect error
- Verify redirect URI in Google Cloud Console matches exactly
- Check that environment variable `GOOGLE_REDIRECT_URI` is correct

### Sync issues
- Check Vercel function logs for errors
- Verify Google Calendar API is enabled
- Ensure OAuth scopes include calendar access

## 📝 Next Steps (Optional)

### Add Automatic Background Sync:
Currently users click "Sync Now" manually. To add automatic syncing:

**Option 1: Vercel Cron** (requires Pro plan)
```json
// Add to vercel.json
"crons": [{
  "path": "/api/google-sync",
  "schedule": "*/30 * * * *"  // Every 30 minutes
}]
```

**Option 2: External Cron** (free)
- Use cron-job.org or GitHub Actions
- Call `/api/google-sync` endpoint periodically

### Add Event Creation from Dog Planner:
Modify your calendar UI to automatically sync when users create events, without requiring manual "Sync Now" button.

## 🎉 You're Done!

Your Dog Planner now has full two-way Google Calendar integration!
