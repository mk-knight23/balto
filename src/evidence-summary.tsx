import { AlertTriangle, FileText, Info } from "lucide-react";
import type { LogEvent } from "./domain";
import { explainEvent } from "./evidence-explainer";

export interface EvidenceSummaryProps {
  events: LogEvent[];
  analyzed: boolean;
  onSelectEvidence: (id: string) => void;
}

export function EvidenceSummary({
  events,
  analyzed,
  onSelectEvidence,
}: EvidenceSummaryProps) {
  if (!analyzed)
    return (
      <section className="es-summary" aria-labelledby="es-title">
        <h3 id="es-title">Your results, in plain English</h3>
        <p>Analyze your input to see an explanation</p>
      </section>
    );
  if (!events.length)
    return (
      <section className="es-summary" aria-labelledby="es-title">
        <h3 id="es-title">Your results, in plain English</h3>
        <p>No log entries to explain</p>
      </section>
    );
  const grouped = new Map<string, LogEvent[]>();
  for (const event of events) {
    const title = explainEvent(event).title;
    const group = grouped.get(title);
    if (group) group.push(event);
    else grouped.set(title, [event]);
  }
  const warnings = events.filter((event) => event.severity === "WARN").length;
  const errors = events.filter(
    (event) => event.severity === "ERROR" || event.severity === "FATAL",
  ).length;
  const unrecognized = events.filter(
    (event) => explainEvent(event).title === "Not recognized by these rules",
  ).length;
  return (
    <section className="es-summary" aria-labelledby="es-title">
      <header className="es-header">
        <Info size={22} aria-hidden="true" />
        <div>
          <h3 id="es-title">Your results, in plain English</h3>
          <p>
            What these log entries say, with their original source attached.
          </p>
        </div>
      </header>
      <div className="es-counts" aria-label="Observed log counts">
        <span>
          <FileText size={16} aria-hidden="true" /> {events.length} total
          entries
        </span>
        <span>
          <AlertTriangle size={16} aria-hidden="true" /> {warnings} labeled WARN
        </span>
        <span>{errors} labeled ERROR or FATAL</span>
        <span>{unrecognized} unrecognized</span>
      </div>
      <p className="es-caveat">
        These are classifications of the provided entries, not diagnoses. A zero
        count means no matching entry was observed in this input; it does not
        prove the system is healthy or that nothing happened. WARN and ERROR
        counts follow the source labels.
      </p>
      <div className="es-groups">
        {[...grouped].map(([title, group]) => {
          const explanation = explainEvent(group[0]);
          const unknownTime = group.filter((event) => !event.utc).length;
          return (
            <article className="es-group" key={title}>
              <h4>
                {title}{" "}
                <span className="pill">
                  {group.length} {group.length === 1 ? "entry" : "entries"}
                </span>
              </h4>
              <p>{explanation.meaning}</p>
              <details className="es-next">
                <summary>What to check next and what remains unknown</summary>
                <p>
                  <strong>Next check:</strong> {explanation.nextCheck}
                </p>
                <p className="es-limitation">
                  <strong>What remains unknown:</strong>{" "}
                  {explanation.limitation}
                </p>
                {unknownTime > 0 && (
                  <p>
                    {unknownTime} of {group.length} entries in this group lack a
                    validated timestamp with an explicit timezone.
                  </p>
                )}
              </details>
              <div
                className="es-sources"
                aria-label={`Source evidence for ${title}`}
              >
                {group.slice(0, 3).map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    onClick={() => onSelectEvidence(event.id)}
                    aria-label={`Select ${event.id}, source line ${event.line}, ${title}`}
                  >
                    {event.id} · line {event.line}
                  </button>
                ))}
              </div>
              <p>
                Showing {Math.min(3, group.length)} of {group.length} source
                references. All entries remain available in the source evidence
                table.
              </p>
              <details className="es-source-detail">
                <summary>Read original source lines for this group</summary>
                <p>
                  Showing {Math.min(3, group.length)} of {group.length} original
                  entries.
                </p>
                {group.slice(0, 3).map((event) => (
                  <div key={event.id}>
                    <p>
                      <strong>{event.id}</strong> · line {event.line} ·{" "}
                      {event.time} · {event.severity}
                    </p>
                    <pre>{event.raw.slice(0, 5000)}</pre>
                    {event.raw.length > 5000 && (
                      <p>
                        Source preview truncated: showing 5,000 of{" "}
                        {event.raw.length.toLocaleString()} characters.
                      </p>
                    )}
                  </div>
                ))}
              </details>
            </article>
          );
        })}
      </div>
      <details className="es-legend">
        <summary>What do L1, WARN and UTC mean?</summary>
        <dl>
          <dt>L1, L2…</dt>
          <dd>
            A source reference: L1 points to line 1 of the input, not an
            incident number.
          </dd>
          <dt>WARN</dt>
          <dd>
            A warning label written by the source application. It is not a
            confirmed cause or a measure of impact.
          </dd>
          <dt>UTC</dt>
          <dd>
            A shared time standard used to compare timestamps. When a valid
            timestamp has no explicit timezone, its UTC time is unknown.
          </dd>
        </dl>
      </details>
    </section>
  );
}
