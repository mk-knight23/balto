"""Evidence-first log extraction: standard library, no telemetry or LLM calls."""

import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone

MAX_BYTES = 1024 * 1024
MAX_LINES = 10000
RULES = [
    ("audio_keepalive_timeout", r"audio-forwarding.*Ping Pong Monitor timeout"),
    ("control_disconnect", r"user socket closed"),
    ("control_connect", r"established connection"),
    ("duplicate_socket", r"Duplicate socket"),
    ("check_start_call", r"CHECK_START_CALL"),
    ("start_call", r"\bSTART_CALL\b"),
    ("audio_connect", r"audio-forwarding.*User .* connected"),
]
ISO_TIMESTAMP = re.compile(
    r"^(\d{4}-\d{2}-\d{2}[Tt ]\d{2}:\d{2}:\d{2}"
    r"(?:\.\d+)?(?:[Zz]|[+-]\d{2}:?\d{2})?)(?=\s|$)"
)
SYSLOG_TIMESTAMP = re.compile(r"^([A-Za-z]{3}\s+\d{1,2} \d{2}:\d{2}:\d{2}(?:\.\d+)?)(?=\s|$)")
SEVERITY = re.compile(r"\b(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL)\b")


def timestamp_metadata(line):
    """Only an explicit source timezone permits a normalized UTC value."""
    match = ISO_TIMESTAMP.match(line)
    if match:
        source = match.group(1)
        try:
            parsed = datetime.fromisoformat(source.replace("t", "T").replace("z", "+00:00").replace("Z", "+00:00"))
        except ValueError:
            return {"source_timestamp": source, "utc": None, "timestamp_status": "invalid"}
        if parsed.tzinfo is None:
            return {"source_timestamp": source, "utc": None, "timestamp_status": "timezone_unknown"}
        precision = "microseconds" if parsed.microsecond else "seconds"
        if "." in source and len(source.split(".", 1)[1].split("+", 1)[0].split("-", 1)[0].rstrip("Zz")) == 3:
            precision = "milliseconds"
        normalized = parsed.astimezone(timezone.utc).isoformat(timespec=precision).replace("+00:00", "Z")
        return {"source_timestamp": source, "utc": normalized, "timestamp_status": "explicit_timezone"}
    match = SYSLOG_TIMESTAMP.match(line)
    if match:
        return {"source_timestamp": match.group(1), "utc": None, "timestamp_status": "year_and_timezone_unknown"}
    return {"source_timestamp": None, "utc": None, "timestamp_status": "missing"}


def analyze(log):
    """Return recognized events and every physical line with unchanged evidence."""
    if len(log.encode("utf-8")) > MAX_BYTES:
        raise ValueError("Log exceeds the 1 MiB UTF-8 limit")
    raw_lines = log.splitlines()
    if len(raw_lines) > MAX_LINES:
        raise ValueError("Log exceeds the 10,000 line limit")
    events = []
    lines = []
    for line_id, line in enumerate(raw_lines, 1):
        severity = SEVERITY.search(line)
        metadata = {
            **timestamp_metadata(line),
            "line_id": line_id,
            "severity": severity.group(1) if severity else None,
            "channel": "audio" if "audio-forwarding" in line else None,
            "text": line,
        }
        kinds = []
        for kind, pattern in RULES:
            if kind == "start_call" and "CHECK_START_CALL" in line:
                continue
            if re.search(pattern, line):
                kinds.append(kind)
                channel = metadata["channel"]
                if channel is None and kind in {"control_connect", "control_disconnect", "duplicate_socket"}:
                    channel = "control"
                events.append({**metadata, "channel": channel, "kind": kind})
        lines.append({**metadata, "channel": events[-1]["channel"] if kinds else metadata["channel"], "kind": kinds[0] if kinds else "unclassified", "kinds": kinds})
    return {
        "events": events,
        "lines": lines,
        "counts": dict(Counter(event["kind"] for event in events)),
        "diagnosis": "Not established from this excerpt",
        "limitations": [
            "Audio timeout does not prove control timeout",
            "Missing START_CALL does not prove recording failed",
            "VPN causal role unconfirmed",
            "Timestamps without an explicit timezone cannot be normalized to UTC",
            "Syslog-style timestamps omit the year and timezone",
        ],
    }


def main(argv=None):
    args = sys.argv[1:] if argv is None else argv
    if len(args) != 1:
        print("Usage: python src/analyzer.py <logfile>", file=sys.stderr)
        return 2
    try:
        with open(args[0], "rb") as file:
            raw = file.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise ValueError("Log exceeds the 1 MiB UTF-8 limit")
        result = analyze(raw.decode("utf-8"))
    except (OSError, UnicodeError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
