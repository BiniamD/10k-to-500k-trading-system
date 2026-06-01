import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.api_response import error_envelope, send_json, success_envelope
from backend.dashboard_service import get_dashboard_snapshot


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            snapshot = get_dashboard_snapshot()
            send_json(self, 200, success_envelope(snapshot["performance"]))
        except Exception as exc:
            send_json(self, 500, error_envelope("INTERNAL_ERROR", "Failed to load performance data", {"reason": str(exc)}))
