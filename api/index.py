from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        response = {
            "status": "ok",
            "message": "10k-to-500k Trading System API",
            "time": datetime.now().isoformat(),
            "features": [
                "Pairs Trading Strategy",
                "Grok xAI Streaming Analysis",
                "Polygon.io Real-time Data",
                "Genetic Algorithm Optimizer",
                "E*TRADE Integration (Sandbox)"
            ]
        }
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        response = {
            "status": "success",
            "message": "Trade signal received"
        }
        self.wfile.write(json.dumps(response).encode())
