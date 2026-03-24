"""Supabase client for calendar integration"""
import os
from supabase import create_client, Client

SUPABASE_URL = f"https://{os.getenv('SUPABASE_PROJECT_ID', 'zkdqvxaihllzqtnuejqa')}.supabase.co"
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZHF2eGFpaGxsenF0bnVlanFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjkwNjMsImV4cCI6MjA4MTY0NTA2M30.T_SA17QrITykMi4uKSEnLFXdEZ572rM8ghDFEM-T1BA')

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_tokens(email: str):
    """Get Google tokens for a user"""
    supabase = get_supabase()
    result = supabase.table('user_calendar_tokens').select('*').eq('email', email).execute()
    return result.data[0] if result.data else None

def save_user_tokens(email: str, tokens: dict):
    """Save Google tokens for a user"""
    supabase = get_supabase()
    data = {
        'email': email,
        'google_tokens': tokens,
        'connected': True,
        'provider': 'google'
    }
    
    existing = get_user_tokens(email)
    if existing:
        supabase.table('user_calendar_tokens').update(data).eq('email', email).execute()
    else:
        supabase.table('user_calendar_tokens').insert(data).execute()

def delete_user_tokens(email: str):
    """Delete Google tokens for a user"""
    supabase = get_supabase()
    supabase.table('user_calendar_tokens').delete().eq('email', email).execute()

def is_user_connected(email: str) -> bool:
    """Check if user has connected calendar"""
    tokens = get_user_tokens(email)
    return bool(tokens and tokens.get('connected'))