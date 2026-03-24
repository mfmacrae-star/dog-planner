"""Sync events between Dog Planner and Google Calendar"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '_utils'))

from google_calendar_service import GoogleCalendarService
from supabase_client import get_supabase, get_user_tokens

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
            
            # Get user tokens
            user_data = get_user_tokens(email)
            if not user_data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Calendar not connected'}).encode())
                return
            
            # Get credentials
            creds = GoogleCalendarService.get_credentials(user_data)
            if not creds:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Invalid credentials'}).encode())
                return
            
            supabase = get_supabase()
            
            # 1. Fetch events from Google Calendar
            google_events = GoogleCalendarService.fetch_events(creds)
            
            # 2. Sync FROM Google Calendar TO Dog Planner
            from_google_count = 0
            for event in google_events:
                event_id = event.get('id')
                title = event.get('summary', 'Untitled Event')
                description = event.get('description', '')
                start = event.get('start', {})
                date = start.get('date') or start.get('dateTime', '').split('T')[0]
                
                if not date:
                    continue
                
                # Check if from Dog Planner (avoid duplicates)
                source = event.get('source', {})
                if source.get('title') == 'Dog Planner':
                    continue
                
                # Check if already exists in Dog Planner
                existing = supabase.table('calendar_events').select('*').eq('email', email).eq('google_event_id', event_id).execute()
                
                if not existing.data:
                    # Create new event in Dog Planner
                    supabase.table('calendar_events').insert({
                        'email': email,
                        'google_event_id': event_id,
                        'title': title,
                        'description': description,
                        'date': date,
                        'synced_from_google': True
                    }).execute()
                    from_google_count += 1
            
            # 3. Sync FROM Dog Planner TO Google Calendar
            planner_events = supabase.table('calendar_events').select('*').eq('email', email).execute()
            to_google_count = 0
            
            for event in planner_events.data:
                google_event_id = event.get('google_event_id')
                
                # Skip if already in Google Calendar
                if google_event_id:
                    continue
                
                # Create in Google Calendar
                google_event = GoogleCalendarService.create_event(
                    creds,
                    event.get('title', 'Dog Planner Event'),
                    event.get('date'),
                    event.get('description', '')
                )
                
                if google_event:
                    # Update Dog Planner event with Google ID
                    supabase.table('calendar_events').update({
                        'google_event_id': google_event['id']
                    }).eq('id', event['id']).execute()
                    to_google_count += 1
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'from_google': from_google_count,
                'to_google': to_google_count
            }).encode())
            
        except Exception as e:
            print(f"Sync error: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()