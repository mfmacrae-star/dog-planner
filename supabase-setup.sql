-- Create table for storing Google Calendar tokens
CREATE TABLE IF NOT EXISTS user_calendar_tokens (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    google_tokens JSONB NOT NULL,
    connected BOOLEAN DEFAULT TRUE,
    provider TEXT DEFAULT 'google',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    google_event_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    synced_from_google BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(email, google_event_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_tokens_email ON user_calendar_tokens(email);
CREATE INDEX IF NOT EXISTS idx_calendar_events_email ON calendar_events(email);
CREATE INDEX IF NOT EXISTS idx_calendar_events_google_id ON calendar_events(google_event_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE user_calendar_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to access their own data
CREATE POLICY "Users can view their own tokens" ON user_calendar_tokens
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own tokens" ON user_calendar_tokens
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own tokens" ON user_calendar_tokens
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own tokens" ON user_calendar_tokens
    FOR DELETE USING (true);

CREATE POLICY "Users can view their own events" ON calendar_events
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own events" ON calendar_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own events" ON calendar_events
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own events" ON calendar_events
    FOR DELETE USING (true);
