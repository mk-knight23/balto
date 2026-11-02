# Four-minute product demonstration script

**00:00–00:25 — Opening**
“I'm presenting Balto, an independent support investigation tool built around a realistic persistent WebSocket escalation. The goal is to make findings reproducible, not to fabricate a diagnosis.”
Screen: white/gold hero and incident summary.

**00:25–01:10 — The problem**
“The agent reports reconnect banners and missing templates. A bandwidth speed test is not proof of connection stability. The primer distinguishes an audio connection from a control connection, so we must investigate both.”
Screen: metrics and findings.

**01:10–02:05 — Timeline**
“We see audio keepalive timeouts at 12:33, 13:48, and 16:12 UTC, a control socket close/re-establish pair around 12:47, and a duplicate socket warning. Calls do start at 16:05 and 16:09; missing START_CALL lines later do not prove failed recording.”
Screen: scroll through chronology.

**02:05–02:50 — Demo**
“Paste an authorized log excerpt. The browser classifies only recognized events; it transmits nothing. The companion Python parser exports structured counts. These are deterministic tools; no live Balto API or model is being used.”
Screen: edit sample logs, click Classify.

**02:50–03:35 — Plan**
“My next steps are controlled VPN and endpoint tests approved by IT, detailed client logs and socket close reasons, and engineering consultation only after evidence establishes an engineering-level issue.”
Screen: investigation runbook.

**03:35–04:00 — Close**
“To verify resolution, I would require stable control and audio sessions across several representative calls, visible templates, expected recordings, and customer signoff. This prototype demonstrates my reasoning and a pathway for support automation.”
Screen: architecture and sources.

Recording note: do not say the website is live unless deployment URL has been verified.
