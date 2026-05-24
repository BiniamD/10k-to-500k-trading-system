from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        data = {
            "status": "ok",
            "system": "10k-to-500k Trading System",
            "description": "Algorithmic pairs trading system targeting 50x growth via disciplined stat-arb.",
            "endpoints": {
                "/api/backtest": "Run a KO-PEP pairs trading backtest and return summary metrics.",
            },
        }
        self.wfile.write(json.dumps(data, indent=2).encode())
