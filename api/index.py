import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.api_response import error_envelope, send_json, success_envelope


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        payload = success_envelope(
            {
                "status": "ok",
                "service": "10k-to-500k Trading System API",
                "endpoints": [
                    "/api/dashboard",
                    "/api/portfolio",
                    "/api/equity",
                    "/api/regime",
                    "/api/performance",
                    "/api/order_flow",
                    "/api/positions",
                    "/api/insights",
                    "/api/backtest",
                ],
            }
        )
        send_json(self, 200, payload)

    def do_POST(self):
        send_json(self, 405, error_envelope("METHOD_NOT_ALLOWED", "Only GET is supported"))
