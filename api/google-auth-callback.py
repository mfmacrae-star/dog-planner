"""Google Calendar OAuth callback endpoint"""
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_utils'))

from google_calendar_service import GoogleCalendarService
from supabase_client import save_user_tokens

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse query parameters
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            
            code = params.get('code', [None])[0]
            state = params.get('state', [None])[0]  # This is the email
            error = params.get('error', [None])[0]
            
            if error:
                # Redirect to frontend with error
                self.send_response(302)
                self.send_header('Location', f'https://dog-planner-one.vercel.app?calendar_error={error}')
                self.end_headers()
                return
            
            if not code or not state:
                self.send_response(302)
                self.send_header('Location', 'https://dog-planner-one.vercel.app?calendar_error=missing_params')
                self.end_headers()
                return
            
            email = state
            
            # Exchange code for tokens
            tokens = GoogleCalendarService.exchange_code_for_tokens(code)
            
            if 'error' in tokens:
                self.send_response(302)
                self.send_header('Location', f'https://dog-planner-one.vercel.app?calendar_error={tokens["error"]}')
                self.end_headers()
                return
            
            # Save tokens to Supabase
            save_user_tokens(email, tokens)
            
            # Redirect to frontend with success
            self.send_response(302)
            self.send_header('Location', 'https://dog-planner-one.vercel.app?calendar_connected=true')
            self.end_headers()
            
        except Exception as e:
            print(f"Callback error: {e}")
            self.send_response(302)
            self.send_header('Location', f'https://dog-planner-one.vercel.app?calendar_error=server_error')
            self.end_headers()