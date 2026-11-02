"""Evidence-first log extraction: standard library, no telemetry or LLM calls."""
import re,sys,json
from collections import Counter
RULES=[("audio_keepalive_timeout",r"audio-forwarding.*Ping Pong Monitor timeout"),("control_disconnect",r"user socket closed"),("control_connect",r"established connection"),("duplicate_socket",r"Duplicate socket"),("check_start_call",r"CHECK_START_CALL"),("start_call",r"\bSTART_CALL\b"),("audio_connect",r"audio-forwarding.*User .* connected")]
def analyze(log):
    events=[]
    for line in log.splitlines():
        ts=re.match(r"^([A-Za-z]{3} \d{1,2} \d\d:\d\d:\d\d\.\d+)",line)
        for kind,pattern in RULES:
            if kind=="start_call" and "CHECK_START_CALL" in line:continue
            if re.search(pattern,line):
                events.append({"utc":ts.group(1) if ts else None,"kind":kind,"text":line})
    return {"events":events,"counts":dict(Counter(e["kind"] for e in events)),"diagnosis":"Not established from this excerpt","limitations":["Audio timeout does not prove control timeout","Missing START_CALL does not prove recording failed","VPN causal role unconfirmed"]}
if __name__=="__main__":
    if len(sys.argv)!=2:raise SystemExit("Usage: python src/analyzer.py <logfile>")
    with open(sys.argv[1],encoding="utf-8") as f:print(json.dumps(analyze(f.read()),indent=2))
