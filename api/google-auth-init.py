"""Google Calendar OAuth initialization endpoint"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add _utils to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_utils'))

from google_calendar_service import GoogleCalendarService

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            data = json.loads(body)
            email = data.get('email')
            
            if not email:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Email required'}).encode())
                return
            
            # Generate authorization URL
            auth_url = GoogleCalendarService.get_authorization_url()
            
            # Add email as state parameter
            auth_url += f'&state={email}'
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'authUrl': auth_url}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()