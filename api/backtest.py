import sys
import os
from http.server import BaseHTTPRequestHandler

# Ensure repo root is on the path so strategy/utils modules resolve
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.api_response import error_envelope, send_json, success_envelope
from backend.dashboard_service import get_backtest_summary


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            result = get_backtest_summary()
            send_json(self, 200, success_envelope(result))
        except Exception as exc:
            send_json(self, 500, error_envelope("INTERNAL_ERROR", "Failed to run backtest summary", {"reason": str(exc)}))
