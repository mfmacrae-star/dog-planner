"""Google Calendar API service"""
import os
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request as GoogleRequest
from google_auth_oauthlib.flow import Flow
import json

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'https://dog-planner-one.vercel.app/api/google-auth-callback')

SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
]

class GoogleCalendarService:
    """Service for Google Calendar operations"""
    
    @staticmethod
    def get_authorization_url() -> str:
        """Generate OAuth authorization URL"""
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [GOOGLE_REDIRECT_URI]
                }
            },
            scopes=SCOPES
        )
        flow.redirect_uri = GOOGLE_REDIRECT_URI
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        return authorization_url
    
    @staticmethod
    def exchange_code_for_tokens(code: str) -> dict:
        """Exchange authorization code for tokens"""
        import requests
        response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'redirect_uri': GOOGLE_REDIRECT_URI,
                'grant_type': 'authorization_code'
            }
        )
        return response.json()
    
    @staticmethod
    def get_credentials(tokens: dict) -> Optional[Credentials]:
        """Create credentials from stored tokens"""
        if not tokens or 'access_token' not in tokens:
            return None
        
        token_data = tokens.get('google_tokens', tokens)
        creds = Credentials(
            token=token_data.get('access_token'),
            refresh_token=token_data.get('refresh_token'),
            token_uri='https://oauth2.googleapis.com/token',
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            scopes=SCOPES
        )
        
        # Refresh if expired
        if creds.expired and creds.refresh_token:
            try:
                creds.refresh(GoogleRequest())
            except:
                return None
        
        return creds
    
    @staticmethod
    def create_event(creds: Credentials, title: str, date: str, description: str = '') -> Optional[dict]:
        """Create a calendar event"""
        try:
            service = build('calendar', 'v3', credentials=creds)
            event = {
                'summary': title,
                'description': description,
                'start': {'date': date, 'timeZone': 'UTC'},
                'end': {'date': date, 'timeZone': 'UTC'},
                'source': {
                    'title': 'Dog Planner',
                    'url': 'https://dog-planner-one.vercel.app'
                }
            }
            return service.events().insert(calendarId='primary', body=event).execute()
        except Exception as e:
            print(f"Error creating event: {e}")
            return None
    
    @staticmethod
    def fetch_events(creds: Credentials, days_ahead: int = 365) -> List[dict]:
        """Fetch calendar events"""
        try:
            service = build('calendar', 'v3', credentials=creds)
            now = datetime.now(timezone.utc)
            time_max = now + timedelta(days=days_ahead)
            
            events_result = service.events().list(
                calendarId='primary',
                timeMin=now.isoformat(),
                timeMax=time_max.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            return events_result.get('items', [])
        except Exception as e:
            print(f"Error fetching events: {e}")
            return []