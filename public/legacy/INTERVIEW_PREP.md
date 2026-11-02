# Interview prep — key questions

**Q: Why not blame VPN?** Because correlation is not causation. Only an approved, controlled comparison with traces can establish its role.

**Q: What is the difference between two sockets?** Control supplies settings/templates and UI content; audio supplies call audio. The log's audio timeout cannot by itself establish the control path's behavior.

**Q: Is the missing START_CALL proof of failed recording?** No. The excerpt may be partial. Cross-check recording records, call IDs, state transitions and server events.

**Q: Why does 70 Mbps not rule out network causes?** Throughput differs from latency, packet loss, policy-driven resets, timeout behavior, and long-lived TCP/WebSocket persistence.

**Q: How do you escalate?** A concise evidence bundle: business impact, scope, UTC timeline, versions, redacted logs, prior troubleshooting, reproduction attempts, actual vs expected result, and explicit asks.

**Q: What is actually built?** Static website, browser classifier, Python parser, tests, sample log. No Balto integration or LLM summarization is in production.

**Q: What would make you close the case?** Evidence-based fix, controlled verification across representative calls, monitoring period, and customer acknowledgement.
