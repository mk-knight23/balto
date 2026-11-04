import { useMemo, useState } from "react";
import type { LogEvent } from "./domain";
import { analyzeConnections } from "./connection-analysis";
import "./connection-explorer.css";

export interface ConnectionExplorerProps {
  events: LogEvent[];
  onSelectEvidence?: (eventId: string) => void;
}

export function ConnectionExplorer({
  events,
  onSelectEvidence,
}: ConnectionExplorerProps) {
  const analysis = useMemo(() => analyzeConnections(events), [events]);
  const [selectedKey, setSelectedKey] = useState("all");
  const [query, setQuery] = useState("");
  const activeKey =
    selectedKey === "all" ||
    analysis.groups.some((group) => group.key === selectedKey)
      ? selectedKey
      : "all";
  const matched = analysis.groups.filter((group) =>
    `${group.identifier.type} ${group.identifier.value} ${group.channel}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const selected = matched.filter(
    (group) => activeKey === "all" || group.key === activeKey,
  );
  const shown = selected.slice(0, 50);
  const evidence = (event: LogEvent) => (
    <details className="ce-evidence" key={event.id}>
      <summary>
        {event.id} · source line {event.line} · {event.time}
      </summary>
      <pre>{event.raw.slice(0, 5000)}</pre>
      {event.raw.length > 5000 && (
        <p>
          Source preview truncated: showing 5,000 of{" "}
          {event.raw.length.toLocaleString()} characters. Select the source
          evidence to inspect the original event.
        </p>
      )}
      {onSelectEvidence && (
        <button type="button" onClick={() => onSelectEvidence(event.id)}>
          Select {event.id} evidence
        </button>
      )}
    </details>
  );
  return (
    <section className="ce-explorer" aria-labelledby="ce-heading">
      <div className="ce-intro">
        <p className="ce-eyebrow">SOURCE-BOUND CONNECTION VIEWS</p>
        <h3 id="ce-heading">Connection &amp; session explorer</h3>
        <p>
          Only explicitly logged IDs are grouped. Audio, control, call and
          unknown channels remain separate. Source order is preserved; elapsed
          time requires explicit timezone-bearing timestamps.
        </p>
      </div>
      <div className="ce-filters">
        <label>
          Explicit ID and channel
          <select
            value={activeKey}
            onChange={(event) => setSelectedKey(event.target.value)}
          >
            <option value="all">
              All explicit ID views ({analysis.groups.length})
            </option>
            {matched.slice(0, 50).map((group) => (
              <option key={group.key} value={group.key}>
                {group.identifier.type}: {group.identifier.value} ·{" "}
                {group.channel}
              </option>
            ))}
          </select>
        </label>
        <label>
          Filter ID views
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedKey("all");
            }}
            placeholder="Search ID or channel"
          />
        </label>
      </div>
      <p className="ce-result-count" role="status">
        Showing {shown.length} of {selected.length} matched ID/channel views (
        {analysis.groups.length} total) · {analysis.unassigned.length}{" "}
        unassigned source events
      </p>
      <p className="ce-note">
        Session/client views do not calculate durations. One event may appear
        under several explicitly logged ID types. View counts overlap and do not
        represent unique sockets. Elapsed intervals describe logged lifecycle
        pairs, not verified network uptime.
      </p>
      {analysis.warnings.length > 0 && (
        <>
          <p>
            Showing {Math.min(100, analysis.warnings.length)} of{" "}
            {analysis.warnings.length} analysis warnings.
          </p>
          <ul className="ce-warning-list">
            {analysis.warnings.slice(0, 100).map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </>
      )}
      {shown.length > 0 ? (
        <div className="ce-table-wrap">
          <table>
            <caption>
              Observed evidence counts by explicit ID and channel
            </caption>
            <thead>
              <tr>
                <th scope="col">Explicit ID</th>
                <th scope="col">Channel</th>
                <th scope="col">Events</th>
                <th scope="col">Duplicates</th>
                <th scope="col">Timeouts</th>
                <th scope="col">Timed pairs</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((group) => (
                <tr key={group.key}>
                  <th scope="row">
                    {group.identifier.type}: {group.identifier.value}
                  </th>
                  <td>{group.channel}</td>
                  <td>{group.sequence.length}</td>
                  <td>{group.duplicateEventIds.length}</td>
                  <td>{group.timeoutEventIds.length}</td>
                  <td>{group.durations.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="ce-empty">
          No matching explicit ID/channel views. Events without a supported
          explicit ID remain unassigned.
        </p>
      )}
      <div className="ce-groups">
        {shown.map((group) => (
          <article className="ce-group" key={group.key}>
            <h4>
              {group.identifier.type}: <span>{group.identifier.value}</span>{" "}
              <small>{group.channel}</small>
            </h4>
            <p>
              Showing {Math.min(100, group.sequence.length)} of{" "}
              {group.sequence.length} source sequence entries.
            </p>
            <ol className="ce-sequence">
              {group.sequence.slice(0, 100).map(({ event, action }, index) => (
                <li key={`${event.id}-${index}`}>
                  <span className={`ce-action ce-action-${action}`}>
                    {action}
                  </span>
                  {evidence(event)}
                </li>
              ))}
            </ol>
            <div className="ce-findings">
              <div>
                <h5>Logged elapsed intervals</h5>
                <p>
                  Showing {Math.min(100, group.durations.length)} of{" "}
                  {group.durations.length} intervals.
                </p>
                {group.durations.length ? (
                  <ul>
                    {group.durations.slice(0, 100).map((duration) => (
                      <li key={`${duration.startId}-${duration.endId}`}>
                        {duration.startId} → {duration.endId}:{" "}
                        {(duration.milliseconds / 1000).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 3 },
                        )}{" "}
                        seconds
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No unambiguous comparable pair available.</p>
                )}
                <h5>Explicit close codes</h5>
                <p>
                  Showing {Math.min(100, group.closeCodes.length)} of{" "}
                  {group.closeCodes.length} close codes.
                </p>
                {group.closeCodes.length ? (
                  <ul>
                    {group.closeCodes.slice(0, 100).map((code, index) => (
                      <li key={`${code.eventId}-${index}`}>
                        {code.eventId}: {code.code}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Not logged.</p>
                )}
              </div>
              <div>
                <h5>Limits &amp; unmatched lifecycle</h5>
                <p>
                  Showing{" "}
                  {Math.min(100, group.warnings.length + group.unknowns.length)}{" "}
                  of {group.warnings.length + group.unknowns.length} findings.
                </p>
                <ul>
                  {[...group.warnings, ...group.unknowns]
                    .slice(0, 100)
                    .map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
      <details className="ce-unassigned">
        <summary>
          Unassigned source evidence ({analysis.unassigned.length})
        </summary>
        <p>
          No supported explicit ID, or conflicting values. These events are not
          combined into a session.
        </p>
        <p>
          Showing {Math.min(100, analysis.unassigned.length)} of{" "}
          {analysis.unassigned.length} unassigned source entries.
        </p>
        {analysis.unassigned.length ? (
          analysis.unassigned.slice(0, 100).map(evidence)
        ) : (
          <p>No unassigned events.</p>
        )}
      </details>
    </section>
  );
}
