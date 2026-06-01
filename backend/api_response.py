from datetime import datetime, timezone
import json

from backend.api_contract import API_SCHEMA_VERSION


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def success_envelope(data):
    return {
        "schemaVersion": API_SCHEMA_VERSION,
        "generatedAt": now_iso(),
        "data": data,
    }


def error_envelope(code: str, message: str, details=None):
    payload = {
        "schemaVersion": API_SCHEMA_VERSION,
        "generatedAt": now_iso(),
        "error": {
            "code": code,
            "message": message,
        },
    }
    if details is not None:
        payload["error"]["details"] = details
    return payload


def send_json(handler, status_code: int, payload):
    handler.send_response(status_code)
    handler.send_header("Content-type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(payload).encode())
