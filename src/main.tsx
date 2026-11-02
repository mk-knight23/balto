import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Command,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  FolderOpen,
  Headphones,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquare,
  Mic,
  Network,
  Pause,
  Play,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Video,
  X,
  Volume2,
  Users,
  Workflow,
  RotateCcw,
  Square,
  Upload,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Compass,
  Maximize2,
  Send,
  GitBranch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  sampleLog,
  parseLogs,
  download,
  toCSV,
  nextCallState,
  scenarioNames,
  scenarioSteps,
  articles,
  searchArticles,
  qaScore,
  syntheticCalls,
  filterCalls,
} from "./domain";
import type { CallState } from "./domain";
import "./style.css";
const sections = [
  {
    group: "WORKSPACE",
    items: [
      { id: "overview", label: "Executive overview", icon: LayoutDashboard },
      { id: "products", label: "Product intelligence", icon: Compass },
    ],
  },
  {
    group: "EXPERIENCE LABS",
    items: [
      { id: "agent", label: "Agent Assist lab", icon: Headphones },
      { id: "knowledge", label: "AI knowledge center", icon: BookOpen },
      { id: "qa", label: "QA automation studio", icon: ClipboardCheck },
      { id: "coaching", label: "Coaching & performance", icon: GraduationCap },
      { id: "insights", label: "Agentic insights", icon: ChartNoAxesCombined },
      { id: "voice", label: "Voice agent simulator", icon: Mic },
    ],
  },
  {
    group: "ENGINEERING",
    items: [
      { id: "incident", label: "Escalation command center", icon: Terminal },
      { id: "diagnostics", label: "WebSocket diagnostics", icon: Network },
      { id: "copilot", label: "Investigation copilot", icon: Sparkles },
    ],
  },
  {
    group: "RESOURCES",
    items: [
      { id: "assessment", label: "Technical assessment", icon: FileText },
      {
        id: "architecture",
        label: "Architecture & engineering",
        icon: Workflow,
      },
      {
        id: "presentation",
        label: "Executive presentation",
        icon: Presentation,
      },
      { id: "library", label: "Evidence & downloads", icon: FolderOpen },
      { id: "video", label: "Video demonstration", icon: Video },
      { id: "about", label: "About the creator", icon: Users },
    ],
  },
];
const pages = sections.flatMap((g) => g.items);
function Icon({
  icon: I,
  size = 18,
  ...rest
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
}) {
  return <I size={size} strokeWidth={1.65} {...rest} />;
}
function Pill({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={"pill " + tone}>{children}</span>;
}
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={"panel " + className}>{children}</section>;
}
function Button({
  children,
  onClick,
  secondary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={"btn " + (secondary ? "secondary" : "")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function SectionHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
function App() {
  const legacyRoutes: Record<string, string> = {
    home: "overview",
    platform: "products",
    workspace: "incident",
    creator: "about",
    slides: "presentation",
    research: "products",
  };
  const requested =
    legacyRoutes[location.hash.slice(1)] || location.hash.slice(1);
  const initial = pages.some((p) => p.id === requested)
    ? requested
    : location.pathname.endsWith("library.html")
      ? "library"
      : "overview";
  const [page, setPage] = useState(initial);
  const [drawer, setDrawer] = useState(false);
  const [command, setCommand] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [walk, setWalk] = useState(false);
  const go = (id: string) => {
    setPage(id);
    location.hash = id;
    setDrawer(false);
    setCommand(false);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const h = () => {
      const id = legacyRoutes[location.hash.slice(1)] || location.hash.slice(1);
      if (pages.some((p) => p.id === id)) setPage(id);
    };
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
      if (e.key === "Escape") {
        setCommand(false);
        setWalk(false);
        setDrawer(false);
      }
    };
    window.addEventListener("hashchange", h);
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("hashchange", h);
      window.removeEventListener("keydown", k);
    };
  }, []);
  useEffect(() => {
    if (!command && !walk && !drawer) return;
    const prior = document.activeElement as HTMLElement | null;
    const dialog =
      document.querySelector("[role=dialog]") ||
      document.querySelector(".sidebar.open");
    const nodes = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button, input, a[href], select, [tabindex="0"]',
        ) || [],
      ).filter(
        (n) => !n.hasAttribute("disabled") && n.getClientRects().length > 0,
      );
    nodes()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = nodes();
      const first = list[0],
        last = list.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      prior?.focus();
    };
  }, [command, walk, drawer]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const notify = (s: string) => setToast(s);
  const current = pages.find((p) => p.id === page) || pages[0];
  return (
    <>
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside
        id="workspace-navigation"
        aria-label="Workspace navigation"
        className={"sidebar " + (drawer ? "open" : "")}
      >
        <button
          className="sidebar-close"
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        >
          <X size={16} />
        </button>
        <a className="brand" href="#overview" onClick={() => go("overview")}>
          <span className="brandmark">
            b<span>•</span>
          </span>
          <strong>
            balto<span className="brand-lab"> / lab</span>
          </strong>
        </a>
        <div className="workspace-switch">
          <span className="workspace-icon">
            <FlaskConical size={17} />
          </span>
          <div>
            <b>Engineering workspace</b>
            <small>Independent candidate project</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <nav>
          {sections.map((g) => (
            <div className="nav-group" key={g.group}>
              <div className="nav-label">{g.group}</div>
              {g.items.map((p) => (
                <button
                  key={p.id}
                  className={"nav-item " + (page === p.id ? "active" : "")}
                  onClick={() => go(p.id)}
                  aria-current={page === p.id ? "page" : undefined}
                >
                  <Icon icon={p.icon} size={17} />
                  <span>{p.label}</span>
                  {p.id === "agent" && <span className="nav-new">LIVE</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-note">
            <span className="status-dot" /> Built to explore. Designed to
            explain.<small>Original simulations. Real engineering.</small>
          </div>
          <button className="creator-mini" onClick={() => go("about")}>
            <span className="avatar">KM</span>
            <span>
              <b>Kazi Musharraf</b>
              <small>Software Developer & AI Engineer</small>
            </span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </aside>
      {drawer && <div className="scrim" onClick={() => setDrawer(false)} />}
      <div className="app-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="mobile-menu"
              aria-label="Open navigation"
              aria-expanded={drawer}
              aria-controls="workspace-navigation"
              onClick={() => setDrawer(!drawer)}
            >
              <Menu size={22} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <b>{current.label}</b>
          </div>
          <div className="top-actions">
            <button
              className="global-search"
              aria-label="Search workspace"
              onClick={() => setCommand(true)}
            >
              <Search size={15} />
              <span>Search workspace</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="top-divider" />
            <span className="demo-badge">
              <span className="status-dot" /> Demo environment
            </span>
            <button
              className="avatar small"
              onClick={() => go("about")}
              aria-label="About Kazi Musharraf"
            >
              KM
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-content">
            {page === "overview" ? (
              <Overview go={go} walkthrough={() => setWalk(true)} />
            ) : (
              <>
                <div className="page-title">
                  <div className="eyebrow">
                    BALTO LAB /{" "}
                    {
                      sections.find((g) => g.items.some((x) => x.id === page))
                        ?.group
                    }
                  </div>
                  <h1>{current.label}</h1>
                  <p>
                    {descriptions[page] ||
                      "Explore the thinking, evidence, and engineering behind this independent project."}
                  </p>
                </div>
                {page === "agent" ? (
                  <AgentLab notify={notify} />
                ) : page === "knowledge" ? (
                  <Knowledge />
                ) : page === "qa" ? (
                  <QA />
                ) : page === "insights" ? (
                  <Insights />
                ) : page === "voice" ? (
                  <Voice />
                ) : page === "incident" ? (
                  <Incident go={go} notify={notify} />
                ) : page === "diagnostics" ? (
                  <Diagnostics notify={notify} />
                ) : page === "copilot" ? (
                  <Copilot notify={notify} />
                ) : page === "presentation" ? (
                  <Slides />
                ) : page === "library" ? (
                  <Library />
                ) : page === "products" ? (
                  <Products />
                ) : page === "assessment" ? (
                  <Assessment notify={notify} />
                ) : page === "architecture" ? (
                  <Architecture />
                ) : page === "video" ? (
                  <VideoStudio />
                ) : page === "coaching" ? (
                  <Coaching go={go} />
                ) : (
                  <About />
                )}
              </>
            )}
            <footer className="footer">
              <span>
                <span className="footer-logo">b.</span> Crafted with curiosity.
                Grounded in evidence.
              </span>
              <span>
                Independent demonstration · Not affiliated with Balto{" "}
                <a
                  href="https://github.com/mk-knight23/balto"
                  target="_blank"
                  rel="noreferrer"
                >
                  View source <ArrowUpRight size={12} />
                </a>
              </span>
            </footer>
          </div>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
      {command && (
        <div className="modal-backdrop" onClick={() => setCommand(false)}>
          <div
            className="command-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Search workspace"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-input">
              <Search size={20} />
              <input
                autoFocus
                placeholder="Where would you like to go?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                aria-label="Close search"
                onClick={() => setCommand(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="command-results">
              {pages
                .filter((p) =>
                  p.label.toLowerCase().includes(query.toLowerCase()),
                )
                .map((p) => (
                  <button key={p.id} onClick={() => go(p.id)}>
                    <Icon icon={p.icon} />
                    {p.label}
                    <ArrowRight size={16} />
                  </button>
                ))}
            </div>
            <small className="command-foot">
              Navigate to any workspace · Esc to close
            </small>
          </div>
        </div>
      )}
      {walk && (
        <div className="modal-backdrop">
          <div role="dialog" aria-modal="true" aria-label="Guided walkthrough">
            <Panel className="walkthrough">
              <button
                className="close"
                aria-label="Close walkthrough"
                onClick={() => setWalk(false)}
              >
                <X />
              </button>
              <Pill>YOUR 3-MINUTE TOUR</Pill>
              <h2>Follow the evidence.</h2>
              <p>
                Start with an interactive call, investigate the connection logs,
                then explore the assessment and downloadable artifacts.
              </p>
              {[
                ["agent", "01", "Experience a simulated call"],
                ["incident", "02", "Investigate the supplied evidence"],
                ["presentation", "03", "See the complete story"],
              ].map(([id, n, s]) => (
                <button
                  className="tour-step"
                  key={id}
                  onClick={() => {
                    setWalk(false);
                    go(id);
                  }}
                >
                  <span>{n}</span>
                  {s}
                  <ArrowRight size={18} />
                </button>
              ))}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
const descriptions: Record<string, string> = {
  agent:
    "A safe place to practice better conversations. Every interaction here is scripted and simulated.",
  knowledge:
    "Find the right information, understand the source, and know what remains uncertain.",
  qa: "Turn a conversation into a transparent, evidence-backed quality evaluation.",
  insights:
    "Explore patterns across a reproducible synthetic dataset. No customer performance data.",
  incident:
    "An evidence-first investigation of intermittent connection interruptions.",
  diagnostics:
    "Turn raw logs into a clear, traceable event timeline. Files stay in your browser.",
  copilot:
    "Structured assistance grounded in the supplied evidence. Deterministic templates; no LLM connected.",
  voice:
    "Explore a transparent conversation state machine, from intent to handoff.",
  presentation:
    "The project story, from product understanding to verification.",
  library:
    "The thinking and supporting artifacts, ready to inspect and download.",
  products:
    "Public product capabilities, translated into original, bounded demonstrations.",
  assessment:
    "Observations, hypotheses, and the next best questions. Never confuse a clue with a cause.",
  coaching:
    "Practice with purpose. Build a coaching plan from visible conversation evidence.",
  video:
    "From evidence to narrative. A production workspace for a future recorded demonstration.",
};
function Orbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-ring ring1" />
      <div className="orbit-ring ring2" />
      <div className="orbit-ring ring3" />
      <div className="orbit-core">
        <span className="brandmark">
          b<span>•</span>
        </span>
      </div>
      <div className="orbit-node node1">
        <Headphones size={20} />
      </div>
      <div className="orbit-node node2">
        <ShieldCheck size={20} />
      </div>
      <div className="orbit-node node3">
        <Sparkles size={20} />
      </div>
      <div className="orbit-node node4">
        <Network size={20} />
      </div>
      <span className="orbit-caption">
        HUMAN INSIGHT. ENGINEERING PRECISION.
      </span>
      <div className="orbit-speck speck1" />
      <div className="orbit-speck speck2" />
    </div>
  );
}
function Overview({
  go,
  walkthrough,
}: {
  go: (s: string) => void;
  walkthrough: () => void;
}) {
  return (
    <>
      <div className="overview-title">
        <div>
          <div className="eyebrow">
            <span className="gold-line" /> THE ENGINEERING BEHIND BETTER
            CONVERSATIONS
          </div>
          <h1>
            A little insight.
            <br className="mobile-only" /> A lot of possibility
            <span className="gold-text">.</span>
          </h1>
          <p>
            Explore the product. Experience the workflows. Follow the evidence.
          </p>
        </div>
        <button className="btn secondary tour-btn" onClick={walkthrough}>
          <Play size={14} /> Take a guided tour <ArrowUpRight size={15} />
        </button>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <Pill>
            <Sparkles size={12} /> AN INDEPENDENT BALTO-INSPIRED PROJECT
          </Pill>
          <h2>
            Where product thinking
            <br />
            meets <em>engineering depth.</em>
          </h2>
          <p>
            A hands-on exploration of contact-center AI — from a better agent
            experience to an evidence-first technical investigation.
          </p>
          <div className="hero-actions">
            <Button onClick={() => go("agent")}>
              <Headphones size={16} /> Explore Agent Assist{" "}
              <ArrowRight size={16} />
            </Button>
            <button className="text-btn" onClick={() => go("incident")}>
              Open investigation <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="hero-foot">
            <span>
              <CheckCheck size={14} /> Interactive by design
            </span>
            <span>
              <ShieldCheck size={14} /> Transparent about limitations
            </span>
          </div>
        </div>
        <Orbit />
      </section>
      <div className="stats-grid">
        {[
          {
            icon: FlaskConical,
            value: "08",
            label: "Conversation scenarios",
            note: "Scripted. Safe to explore.",
          },
          {
            icon: Network,
            value: "09",
            label: "Source log entries",
            note: "Traceable to the original excerpt.",
          },
          {
            icon: LayersIcon,
            value: "07",
            label: "Knowledge articles",
            note: "Local, source-cited retrieval.",
          },
          {
            icon: Code2,
            value: "100%",
            label: "Browser-local simulations",
            note: "No API keys or customer data.",
          },
        ].map((s) => (
          <Panel className="stat" key={s.label}>
            <div className="stat-top">
              <span className="icon-box">
                <Icon icon={s.icon} />
              </span>
              <span className="stat-value">{s.value}</span>
            </div>
            <b>{s.label}</b>
            <small>{s.note}</small>
          </Panel>
        ))}
      </div>
      <SectionHead
        title="Your workspace, connected."
        description="Go from understanding to hands-on exploration."
        action={
          <button
            className="text-btn small-text"
            onClick={() => go("products")}
          >
            Explore the platform <ArrowRight size={14} />
          </button>
        }
      />
      <div className="feature-grid">
        <button className="feature-card" onClick={() => go("agent")}>
          <div className="feature-top">
            <span className="large-icon gold">
              <Headphones size={22} />
            </span>
            <Pill tone="green">
              <span className="status-dot" /> INTERACTIVE LAB
            </Pill>
          </div>
          <h3>A better conversation starts here.</h3>
          <p>
            Step into the agent workspace. Follow a live scripted call, discover
            contextual guidance, and complete the checklist.
          </p>
          <div className="mini-transcript">
            <span className="mini-avatar">C</span>
            <div>
              “My bill is higher than I expected…”
              <span className="mini-bars">▂ ▄ ▆ ▃ ▇ ▄ ▂ ▅ ▃ ▆ ▂ ▄ ▅ ▃ ▂ ▄</span>
            </div>
            <span className="mini-live">SIMULATED</span>
          </div>
          <span className="feature-link">
            Launch Agent Assist lab <ArrowRight size={16} />
          </span>
        </button>
        <button
          className="feature-card engineering"
          onClick={() => go("incident")}
        >
          <div className="feature-top">
            <span className="large-icon navy">
              <Terminal size={22} />
            </span>
            <Pill tone="neutral">EVIDENCE-FIRST</Pill>
          </div>
          <h3>Every signal has a story.</h3>
          <p>
            Investigate a WebSocket incident. Connect the timeline, challenge
            hypotheses, and choose the next diagnostic step.
          </p>
          <div className="mini-log">
            <span>
              12:33:06.442 <b>WARN</b>
            </span>
            <code>audio-forwarding · ping/pong timeout</code>
            <span className="log-evidence">
              L1 <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="feature-link">
            Open escalation command center <ArrowRight size={16} />
          </span>
        </button>
      </div>
      <div className="overview-bottom">
        <Panel className="activity-panel">
          <SectionHead
            title="A view into the conversation."
            action={<Pill tone="neutral">SYNTHETIC DATA</Pill>}
          />
          <div className="chart-legend">
            <span>
              <i className="legend-dot gold-bg" />
              Conversation volume
            </span>
            <span>
              <i className="legend-dot navy-bg" />
              Quality score
            </span>
            <button onClick={() => go("insights")}>
              Explore insights <ArrowUpRight size={13} />
            </button>
          </div>
          <ActivityChart />
          <div className="chart-caption">
            Illustrative sample only. Open Insights for calculated metrics and
            filters.
          </div>
        </Panel>
        <Panel className="next-panel">
          <div className="small-eyebrow">BUILT WITH INTENTION</div>
          <h3>More than a product demo.</h3>
          <p>A window into how I think, investigate, and build.</p>
          {[
            {
              icon: Search,
              t: "Follow the evidence",
              s: "Technical assessment",
              id: "assessment",
            },
            {
              icon: Presentation,
              t: "See the bigger picture",
              s: "Executive presentation",
              id: "presentation",
            },
            {
              icon: FolderOpen,
              t: "Take a closer look",
              s: "Evidence & downloads",
              id: "library",
            },
          ].map((x) => (
            <button className="next-item" key={x.id} onClick={() => go(x.id)}>
              <span className="next-icon">
                <Icon icon={x.icon} size={17} />
              </span>
              <span>
                <b>{x.t}</b>
                <small>{x.s}</small>
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
        </Panel>
      </div>
      <div className="disclosure">
        <ShieldCheck size={16} />
        <span>
          <b>A thoughtful demonstration, with clear boundaries.</b> All calls
          are simulated. Analytics are synthetic. Investigations cite supplied
          evidence. No production Balto integration.
        </span>
        <button onClick={() => go("architecture")}>
          How it’s built <ArrowUpRight size={14} />
        </button>
      </div>
    </>
  );
}
const LayersIcon = BookOpen;
function ActivityChart() {
  return (
    <div className="activity-chart">
      <div className="chart-y">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
      </div>
      <div className="chart-drawing">
        <svg
          viewBox="0 0 620 130"
          preserveAspectRatio="none"
          role="img"
          aria-label="Illustrative synthetic conversation and quality trends"
        >
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#c29c53" stopOpacity=".22" />
              <stop offset="1" stopColor="#c29c53" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[18, 50, 82, 114].map((y) => (
            <line
              key={y}
              x1="0"
              x2="620"
              y1={y}
              y2={y}
              stroke="#ecebe6"
              strokeDasharray="3 5"
            />
          ))}
          <path
            d="M0 100 C30 100 40 63 75 74 S125 104 150 65 S190 80 220 57 S270 77 305 43 S355 70 385 49 S430 55 460 27 S520 50 550 21 S590 38 620 12 V130 H0Z"
            fill="url(#area)"
          />
          <path
            d="M0 100 C30 100 40 63 75 74 S125 104 150 65 S190 80 220 57 S270 77 305 43 S355 70 385 49 S430 55 460 27 S520 50 550 21 S590 38 620 12"
            stroke="#bb934a"
            fill="none"
            strokeWidth="2.3"
          />
          <path
            d="M0 75 C50 70 60 85 110 69 S150 78 200 68 S270 53 310 65 S370 40 410 51 S470 38 520 43 S575 27 620 31"
            stroke="#66788a"
            fill="none"
            strokeWidth="1.8"
            strokeDasharray="4 4"
          />
        </svg>
        <div className="chart-x">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
function AgentLab({ notify }: { notify: (s: string) => void }) {
  const [scenario, setScenario] = useState(scenarioNames[0]);
  const [state, setState] = useState<CallState>("idle");
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false]);
  const steps = scenarioSteps(scenario);
  const knowledge =
    articles[
      scenario === "Technical troubleshooting"
        ? 2
        : scenario === "Insurance inquiry"
          ? 4
          : scenario === "Payment collection"
            ? 5
            : scenario === "Cancellation request"
              ? 1
              : scenario === "Subscription renewal"
                ? 6
                : scenario === "Customer frustration" ||
                    scenario === "Supervisor escalation"
                  ? 3
                  : 0
    ];
  useEffect(() => {
    if (state !== "active") return;
    const t = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  useEffect(() => {
    if (state !== "active") return;
    const t = setInterval(
      () => setStep((v) => Math.min(v + 1, steps.length - 1)),
      5500,
    );
    return () => clearInterval(t);
  }, [state, scenario]);
  const act = (a: string) => {
    setState((s) => nextCallState(s, a));
    if (a === "start") {
      setStep(0);
      setElapsed(0);
      setChecks([false, false, false, false]);
    }
  };
  return (
    <>
      <div className="toolbar">
        <label>
          Scenario{" "}
          <select
            value={scenario}
            disabled={state === "active" || state === "paused"}
            onChange={(e) => {
              setScenario(e.target.value);
              act("reset");
            }}
          >
            {scenarioNames.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <Pill tone={state === "active" ? "green" : "neutral"}>
          <span className="status-dot" />
          {state === "active" ? "SIMULATED CALL ACTIVE" : state.toUpperCase()}
        </Pill>
        <span className="toolbar-spacer" />
        <span className="timer">
          <Clock size={15} />
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
          {String(elapsed % 60).padStart(2, "0")}
        </span>
        {state === "idle" || state === "ended" ? (
          <Button onClick={() => act("start")}>
            <Play size={15} />
            Start call
          </Button>
        ) : (
          <>
            <Button
              secondary
              onClick={() => act(state === "active" ? "pause" : "resume")}
            >
              {state === "active" ? <Pause size={15} /> : <Play size={15} />}{" "}
              {state === "active" ? "Pause" : "Resume"}
            </Button>
            <Button onClick={() => act("end")}>
              <Square size={14} />
              End call
            </Button>
          </>
        )}
      </div>
      <div className="stage-track">
        {[
          "Greeting",
          "Discover",
          "Verify",
          "Investigate",
          "Resolve",
          "Wrap up",
        ].map((s, i) => (
          <span key={s} className={state !== "idle" && step >= i ? "done" : ""}>
            <b>{step > i ? <Check size={12} /> : i + 1}</b>
            {s}
          </span>
        ))}
      </div>
      <div className="lab-grid">
        <Panel className="transcript-panel">
          <SectionHead
            title="The conversation"
            action={<Pill tone="neutral">SCRIPTED TRANSCRIPT</Pill>}
          />
          {state === "idle" ? (
            <div className="empty">
              <Headphones size={40} />
              <h3>Your next conversation starts here.</h3>
              <p>Select a scenario and start the simulated call.</p>
            </div>
          ) : (
            <>
              <div className="transcript" aria-live="polite">
                {steps.slice(0, step + 1).map((s, i) => (
                  <div
                    className={
                      "bubble-row " +
                      (s.speaker === "Agent" ? "agent-bubble" : "")
                    }
                    key={i}
                  >
                    <span className="speaker-avatar">
                      {s.speaker === "Agent" ? "A" : "C"}
                    </span>
                    <div>
                      <div className="bubble-meta">
                        {s.speaker}
                        <span>00:{String(i * 6).padStart(2, "0")}</span>
                      </div>
                      <p>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {state === "active" && step < 5 && (
                <Button
                  secondary
                  onClick={() => setStep((v) => Math.min(5, v + 1))}
                >
                  Next transcript event <ArrowRight size={15} />
                </Button>
              )}
            </>
          )}
        </Panel>
        <div className="lab-side">
          <Panel className="guidance">
            <SectionHead
              title="In the moment"
              action={<Sparkles size={19} />}
            />
            <div className="small-eyebrow">CONTEXTUAL GUIDANCE</div>
            <h3>
              {state === "idle"
                ? "Ready when you are."
                : steps[step].stage === "Discover"
                  ? "Listen. Acknowledge. Clarify."
                  : steps[step].stage}
            </h3>
            <p>
              {state === "idle"
                ? "Guidance will change as the scripted conversation progresses."
                : steps[step].suggestion}
            </p>
            <div className="guidance-tags">
              <Pill tone="neutral">{scenario}</Pill>
              <Pill tone="green">
                {step < 2 ? "Sentiment: uncertain" : "Sentiment: improving"}
              </Pill>
            </div>
            <small>Rule-based suggestions · Scripted sentiment</small>
          </Panel>
          <Panel>
            <SectionHead
              title="Call essentials"
              action={<small>{checks.filter(Boolean).length}/4 complete</small>}
            />
            {[
              "Introduce agent & disclose recording",
              "Verify customer identity",
              "Explain approved next steps",
              "Confirm summary & follow-up",
            ].map((s, i) => (
              <label className="check-row" key={s}>
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() =>
                    setChecks((v) => v.map((b, j) => (i === j ? !b : b)))
                  }
                />
                <span>{s}</span>
              </label>
            ))}
          </Panel>
          <Panel>
            <div className="small-eyebrow">KNOWLEDGE AT HAND</div>
            <h3>{knowledge.title}</h3>
            <p className="compact-p">{knowledge.body}</p>
            <small>Local training knowledge · No account changes</small>
          </Panel>
        </div>
      </div>
      {state === "ended" && (
        <Panel className="summary">
          <SectionHead
            title="Call summary"
            action={
              <Button
                secondary
                onClick={() => {
                  download(
                    "call-summary.json",
                    JSON.stringify(
                      {
                        scenario,
                        elapsed,
                        events: steps.slice(0, step + 1),
                        completedChecklist: checks,
                      },
                      null,
                      2,
                    ),
                    "application/json",
                  );
                  notify("Call summary downloaded");
                }}
              >
                <Download size={15} />
                Export summary
              </Button>
            }
          />
          <p>
            <b>Intent:</b> {scenario}. <b>Observed stage:</b>{" "}
            {steps[step].stage}. {checks.filter(Boolean).length} of 4 checklist
            items marked by the user.
          </p>
          <p>
            <b>Next action:</b> Document the request, verify authorization, and
            confirm a follow-up.{" "}
            {step < 5
              ? "The call ended before all scripted events were shown."
              : "All scripted events were shown; no production action occurred."}
          </p>
        </Panel>
      )}
    </>
  );
}
function Knowledge() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All categories");
  const [history, setHistory] = useState<string[]>([]);
  const [selected, setSelected] = useState(articles[0]);
  const results = searchArticles(q, category);
  return (
    <>
      <div className="notice">
        <BookOpen size={18} />
        <span>
          Approved local sample knowledge. Deterministic keyword matching, with
          citations. No production RAG integration.
        </span>
      </div>
      <div className="search-bar">
        <Search size={19} />
        <input
          aria-label="Search knowledge"
          placeholder="Search billing, WebSockets, escalation…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => {
            if (q)
              setHistory((h) => [q, ...h.filter((x) => x !== q)].slice(0, 5));
          }}
        />
        <select
          aria-label="Article category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {[
            "All categories",
            "Billing",
            "Retention",
            "Technical",
            "Support",
            "Insurance",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="two-col">
        <Panel>
          <SectionHead title={`${results.length} relevant articles`} />
          {results.map((a) => (
            <button
              className={
                "article-row " + (selected.id === a.id ? "selected" : "")
              }
              key={a.id}
              onClick={() => setSelected(a)}
            >
              <span className="icon-box">
                <FileText size={18} />
              </span>
              <span>
                <b>{a.title}</b>
                <small>
                  {a.id} · {a.category}
                </small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
          {!results.length && (
            <div className="empty">
              <Search />
              <h3>No supported answer found.</h3>
              <p>
                Try fewer keywords. Missing information should be escalated to a
                human.
              </p>
            </div>
          )}
          {history.length > 0 && (
            <>
              <div className="small-eyebrow history-heading">
                SESSION SEARCH HISTORY
              </div>
              <div className="chips">
                {history.map((h) => (
                  <button key={h} onClick={() => setQ(h)}>
                    {h}
                  </button>
                ))}
              </div>
            </>
          )}
        </Panel>
        <Panel>
          <Pill>{selected.category}</Pill>
          <h2>{selected.title}</h2>
          <p className="article-body">{selected.body}</p>
          <div className="citation">
            <ShieldCheck size={18} />
            <div>
              <b>Source: {selected.id}</b>
              <p>
                Local approved training sample. Last reviewed November 3, 2026.
                Not a Balto policy.
              </p>
            </div>
          </div>
          <h3>Related reading</h3>
          {articles
            .filter(
              (a) =>
                a.id !== selected.id &&
                (a.category === selected.category || a.category === "Support"),
            )
            .slice(0, 2)
            .map((a) => (
              <button
                className="link-row"
                key={a.id}
                onClick={() => setSelected(a)}
              >
                {a.title}
                <ArrowRight size={15} />
              </button>
            ))}
          <div className="notice subtle">
            Account-specific eligibility, amounts, and policies are unavailable
            in this sample.
          </div>
        </Panel>
      </div>
    </>
  );
}
function QA() {
  const [scenario, setScenario] = useState(scenarioNames[0]);
  const [rules, setRules] = useState([
    { label: "Recording disclosure", term: "recorded", weight: 20, pass: true },
    {
      label: "Identity verification",
      term: "verify your identity",
      weight: 30,
      pass: true,
    },
    {
      label: "Acknowledgment and empathy",
      term: "frustrating",
      weight: 20,
      pass: true,
    },
    {
      label: "Explicit follow-up commitment",
      term: "business day",
      weight: 30,
      pass: false,
    },
  ]);
  const [reviewed, setReviewed] = useState(false);
  const score = qaScore(rules);
  const steps = scenarioSteps(scenario);
  return (
    <>
      <div className="toolbar">
        <label>
          Sample conversation{" "}
          <select
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              setReviewed(false);
            }}
          >
            {scenarioNames.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <span className="toolbar-spacer" />
        <Button
          secondary
          onClick={() =>
            download(
              "qa-evaluation.json",
              JSON.stringify(
                {
                  scenario,
                  score,
                  rules,
                  reviewed,
                  method:
                    "Visible weighted checklist; human override available",
                },
                null,
                2,
              ),
              "application/json",
            )
          }
        >
          <Download size={15} />
          Export evaluation
        </Button>
      </div>
      <div className="qa-grid">
        <Panel>
          <SectionHead
            title="Conversation evidence"
            action={<Pill tone="neutral">SIMULATED</Pill>}
          />
          {steps.map((s, i) => (
            <div className="review-line" key={i}>
              <code>T{i + 1}</code>
              <div>
                <b>{s.speaker}</b>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </Panel>
        <Panel>
          <div className="score-circle">
            <b>
              {score}
              <small>/100</small>
            </b>
            <span>Weighted quality score</span>
          </div>
          <SectionHead
            title="Make the rules visible."
            description="Checkboxes allow human override. Weights determine the score."
          />
          {rules.map((r, i) => (
            <div className="rule" key={r.label}>
              <label>
                <input
                  type="checkbox"
                  checked={r.pass}
                  onChange={() => {
                    setRules((v) =>
                      v.map((x, j) => (j === i ? { ...x, pass: !x.pass } : x)),
                    );
                    setReviewed(false);
                  }}
                />
                <b>{r.label}</b>
              </label>
              <div>
                <small>
                  {steps.some((s) => s.text.toLowerCase().includes(r.term))
                    ? `Detected in T${steps.findIndex((s) => s.text.toLowerCase().includes(r.term)) + 1}`
                    : "Required phrase not detected"}{" "}
                  · “{r.term}”
                </small>
                <input
                  type="number"
                  min="0"
                  max="100"
                  aria-label={r.label + " weight"}
                  value={r.weight}
                  onChange={(e) => {
                    setRules((v) =>
                      v.map((x, j) =>
                        i === j
                          ? {
                              ...x,
                              weight: Math.max(
                                0,
                                Math.min(100, Number(e.target.value)),
                              ),
                            }
                          : x,
                      ),
                    );
                    setReviewed(false);
                  }}
                />
              </div>
            </div>
          ))}
          <p className="formula">
            Score = passed weight ÷ total weight × 100.
            <br />
            Phrase detection is a demonstration, not semantic compliance
            evaluation.
          </p>
          <Button onClick={() => setReviewed(!reviewed)}>
            <CheckCheck size={16} />
            {reviewed
              ? "Reviewed — click to reopen"
              : "Mark human review complete"}
          </Button>
        </Panel>
      </div>
    </>
  );
}
function Insights() {
  const [agent, setAgent] = useState("All agents");
  const [scenario, setScenario] = useState("All scenarios");
  const [days, setDays] = useState(30);
  const [sort, setSort] = useState<"qa" | "duration">("qa");
  const [compare, setCompare] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const rows = filterCalls(syntheticCalls, agent, scenario, days);
  const previous = filterCalls(syntheticCalls, agent, scenario, 30).filter(
    (r) => r.day > days,
  );
  const avg = (key: "duration" | "qa", r = rows) =>
    r.length ? Math.round(r.reduce((s, x) => s + x[key], 0) / r.length) : 0;
  return (
    <>
      <div className="toolbar">
        <Pill tone="neutral">SYNTHETIC · 96 SAMPLE CALLS</Pill>
        <select
          aria-label="Date range"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>First 7 sample days</option>
          <option value={14}>First 14 sample days</option>
          <option value={30}>All 30 sample days</option>
        </select>
        <select
          aria-label="Filter agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
        >
          {["All agents", "Alex", "Jamie", "Morgan"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filter scenario"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        >
          {["All scenarios", ...scenarioNames].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <Button
          secondary
          onClick={() =>
            download(
              "synthetic-calls.csv",
              toCSV(
                [
                  "ID",
                  "Day",
                  "Agent",
                  "Scenario",
                  "Duration seconds",
                  "QA",
                  "Resolved",
                  "Escalated",
                ],
                rows.map((r) => Object.values(r)),
              ),
              "text/csv",
            )
          }
        >
          <Download size={15} />
          CSV
        </Button>
      </div>
      <div className="stats-grid">
        {[
          ["Calls in selection", rows.length],
          ["Average handle time", `${avg("duration")}s`],
          ["Average QA", `${avg("qa")} / 100`],
          [
            "First-contact resolution",
            `${rows.length ? Math.round((rows.filter((r) => r.resolved).length / rows.length) * 100) : 0}%`,
          ],
        ].map(([k, v]) => (
          <Panel className="metric" key={k}>
            <small>{k}</small>
            <strong>{v}</strong>
            <span>Calculated from sample rows</span>
          </Panel>
        ))}
      </div>
      <div className="two-col">
        <Panel>
          <SectionHead
            title="Customer intent distribution"
            description="Hover over each bar to inspect the sample count."
          />
          {scenarioNames.map((s) => {
            const n = rows.filter((r) => r.scenario === s).length;
            return (
              <div
                className="bar-row"
                key={s}
                title={`${s}: ${n} synthetic calls`}
              >
                <span>{s}</span>
                <div>
                  <i
                    style={{
                      width: `${rows.length ? (n / rows.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <b>{n}</b>
              </div>
            );
          })}
        </Panel>
        <Panel>
          <SectionHead
            title="A transparent comparison"
            description="Compare the selected sample days with remaining days."
          />
          <label className="check-row">
            <input
              type="checkbox"
              checked={compare}
              onChange={() => setCompare(!compare)}
            />
            Show comparison
          </label>
          {compare ? (
            <>
              <div className="comparison">
                <div>
                  <small>Selected period</small>
                  <strong>{avg("qa")}</strong>
                  <p>{rows.length} calls · Average QA</p>
                </div>
                <div>
                  <small>Remaining sample days</small>
                  <strong>{previous.length ? avg("qa", previous) : "—"}</strong>
                  <p>
                    {previous.length} calls ·{" "}
                    {previous.length ? "Average QA" : "Choose 7 or 14 days"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>
              Use the comparison control to see how calculated quality varies
              across the sample period.
            </p>
          )}
          <div className="notice">
            <AlertTriangle size={16} />
            <span>
              {rows.filter((r) => r.escalated).length} synthetic escalations.
              Connection stability and incident recurrence are unavailable in
              this call dataset.
            </span>
          </div>
        </Panel>
      </div>
      <Panel>
        <SectionHead
          title="Inspect the underlying records"
          action={
            <label>
              Sort by{" "}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "qa" | "duration")}
              >
                <option value="qa">QA score</option>
                <option value="duration">Duration</option>
              </select>
            </label>
          }
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Agent</th>
                <th>Scenario</th>
                <th>Duration</th>
                <th>QA</th>
                <th>Outcome</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {[...rows]
                .sort((a, b) => b[sort] - a[sort])
                .map((r) => (
                  <React.Fragment key={r.id}>
                    <tr>
                      <td>
                        <code>{r.id}</code>
                      </td>
                      <td>{r.agent}</td>
                      <td>{r.scenario}</td>
                      <td>{r.duration}s</td>
                      <td>{r.qa}</td>
                      <td>
                        <Pill tone={r.resolved ? "green" : "neutral"}>
                          {r.resolved ? "Resolved" : "Follow-up"}
                        </Pill>
                      </td>
                      <td>
                        <button
                          aria-label={"Inspect " + r.id}
                          onClick={() =>
                            setDetail(detail === r.id ? null : r.id)
                          }
                        >
                          <ChevronDown size={16} />
                        </button>
                      </td>
                    </tr>
                    {detail === r.id && (
                      <tr>
                        <td colSpan={7}>
                          Synthetic day {r.day}. Escalation:{" "}
                          {r.escalated ? "Yes" : "No"}. This row is generated
                          deterministically; no source transcript or actual
                          customer outcome exists.
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="empty">No calls match these filters.</div>
          )}
        </div>
      </Panel>
    </>
  );
}
function Voice() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "Simulator",
      text: "Hello. I can help with billing, renewal, or a technical issue. What brings you here?",
    },
  ]);
  const [stage, setStage] = useState("Discover");
  const [uncertain, setUncertain] = useState(0);
  const send = () => {
    if (!input.trim()) return;
    const t = input.trim();
    let reply = "",
      next = "Clarify";
    if (/human|supervisor|agent/i.test(t)) {
      reply =
        "A human handoff is recommended. In this demo no transfer is performed.";
      next = "Human escalation";
    } else if (/bill|charge|refund/i.test(t)) {
      reply =
        articles[0].body +
        " Would you like to finish this simulated conversation?";
      next = "Knowledge lookup · KB-001";
    } else if (/renew|subscription/i.test(t)) {
      reply = articles[6].body;
      next = "Knowledge lookup · KB-007";
    } else if (/network|connect|technical|websocket/i.test(t)) {
      reply = articles[2].body;
      next = "Knowledge lookup · KB-003";
    } else if (/yes|done|thank|finish/i.test(t)) {
      reply =
        "The simulated conversation is complete. No account change or support action occurred.";
      next = "Complete";
    } else {
      reply =
        uncertain >= 1
          ? "I do not have enough supported information. A human handoff is recommended."
          : "Could you clarify: is this about billing, renewal, or a technical connection issue?";
      next = uncertain >= 1 ? "Human escalation" : "Clarify";
      setUncertain((v) => v + 1);
    }
    setMessages((v) => [
      ...v,
      { role: "You", text: t },
      { role: "Simulator", text: reply },
    ]);
    setStage(next);
    setInput("");
  };
  return (
    <div className="two-col">
      <Panel>
        <SectionHead
          title="A conversation you can inspect"
          action={<Pill>DETERMINISTIC</Pill>}
        />
        <div className="voice-messages" aria-live="polite">
          {messages.map((m, i) => (
            <div
              className={
                "voice-message " + (m.role === "You" ? "from-user" : "")
              }
              key={i}
            >
              <small>{m.role}</small>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            aria-label="Voice simulator message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try ‘I have a billing question’"
            maxLength={1000}
          />
          <button className="btn" type="submit" aria-label="Send message">
            <Send size={17} />
          </button>
        </form>
      </Panel>
      <Panel>
        <div className="large-icon gold">
          <Workflow />
        </div>
        <h2>State, not magic.</h2>
        <p>
          Each answer follows visible keyword rules, a local article, or an
          explicit uncertainty path.
        </p>
        <div className="state-path">
          {[
            "Discover",
            "Clarify",
            "Knowledge lookup",
            "Human escalation",
            "Complete",
          ].map((s) => (
            <div key={s} className={stage.includes(s) ? "current" : ""}>
              <span className="status-dot" />
              {s}
            </div>
          ))}
        </div>
        <Pill tone="green">Current: {stage}</Pill>
        <p>
          Uncertainty:{" "}
          {stage === "Clarify"
            ? "Unsupported intent"
            : "Rule matched; not a probability"}
          . Two unclear messages trigger a human handoff recommendation.
        </p>
        <div className="button-row">
          <Button
            secondary
            onClick={() => {
              if ("speechSynthesis" in window) {
                speechSynthesis.cancel();
                speechSynthesis.speak(
                  new SpeechSynthesisUtterance(messages.at(-1)?.text || ""),
                );
              }
            }}
          >
            <Volume2 size={16} />
            Read last response
          </Button>
          <Button
            secondary
            onClick={() => {
              setMessages([
                {
                  role: "Simulator",
                  text: "Hello. Billing, renewal, or technical support?",
                },
              ]);
              setStage("Discover");
              setUncertain(0);
            }}
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
        <small>
          Optional device speech synthesis. No Balto voice model, speech
          recognition, or telephony connection.
        </small>
      </Panel>
    </div>
  );
}
const hypotheses = [
  {
    name: "VPN / proxy inspection",
    team: "Customer IT",
    support: "VPN use is reported. Repeated audio timeouts occur (L1, L4, L8).",
    against: "No approved VPN comparison or network trace was supplied.",
    test: "Run a time-aligned VPN on/off comparison only with IT authorization.",
    why: "A controlled comparison can isolate the network path while keeping app and workload constant.",
  },
  {
    name: "Endpoint or runtime stall",
    team: "Desktop / Engineering",
    support:
      "Temporary improvement after restart is reported in the assessment.",
    against: "No CPU profile, OS event log, or endpoint-security evidence.",
    test: "Capture client resource usage and endpoint logs during a recurrence.",
    why: "A stalled client may delay keepalive replies even when bandwidth is adequate.",
  },
  {
    name: "Reconnection / session handling",
    team: "Application Engineering",
    support:
      "Duplicate socket event appears at L5; control reconnect appears at L2–L3.",
    against:
      "Connection IDs and expected duplicate handling semantics are absent.",
    test: "Correlate session IDs, close codes, and application state across both channels.",
    why: "Temporal proximity alone does not establish that a duplicate caused the user’s symptoms.",
  },
  {
    name: "Backend service instability",
    team: "Platform Engineering",
    support: "Server-side connection events are present at L2–L3.",
    against: "No regional or multi-user health metrics were supplied.",
    test: "Compare server health and affected-user scope at the same times.",
    why: "Scope comparison distinguishes a single-endpoint issue from a broader service event.",
  },
];
function useSessionList(key: string, initial: string[]) {
  const [value, setValue] = useState<string[]>(() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem(key) || "null");
      return Array.isArray(raw) && raw.every((x) => typeof x === "string")
        ? raw
        : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Session storage can be unavailable in private browser modes. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}
function Incident({
  go,
  notify,
}: {
  go: (s: string) => void;
  notify: (s: string) => void;
}) {
  const [tab, setTab] = useState("Timeline");
  const [selected, setSelected] = useState(0);
  const [statuses, setStatuses] = useSessionList("balto-hypothesis-statuses", [
    "Open",
    "Open",
    "Open",
    "Open",
  ]);
  const [history, setHistory] = useSessionList(
    "balto-investigation-history",
    [],
  );
  const [answer, setAnswer] = useState("");
  const events = parseLogs(sampleLog);
  return (
    <>
      <div className="incident-banner">
        <span className="incident-symbol">
          <Network size={24} />
        </span>
        <div>
          <div className="eyebrow">
            ASSESSMENT EXERCISE · NORTHWIND SERVICES
          </div>
          <h2>Intermittent connection interruptions</h2>
          <p>
            Reported impact: reconnect banner and missing guidance templates.
            Cause and shared trigger unconfirmed.
          </p>
        </div>
        <Pill tone="gold">Severity: awaiting scope</Pill>
      </div>
      <div className="stats-grid">
        {[
          ["Audio channel", "3 observed timeouts", "L1 · L4 · L8"],
          ["Control channel", "1 reconnect pair", "L2 → L3 · 3.203 seconds"],
          [
            "Call lifecycle",
            "1 observed START_CALL",
            "L7 · no recording outcome supplied",
          ],
          [
            "Root cause",
            "Not established",
            "4 hypotheses · evidence incomplete",
          ],
        ].map(([l, v, s]) => (
          <Panel className="metric" key={l}>
            <small>{l}</small>
            <strong className="smaller">{v}</strong>
            <span>{s}</span>
          </Panel>
        ))}
      </div>
      <div className="tabs">
        {[
          "Timeline",
          "Hypotheses",
          "Next diagnostic step",
          "Investigation notes",
        ].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <button className="tab-action" onClick={() => go("diagnostics")}>
          Open diagnostics lab <ArrowUpRight size={14} />
        </button>
      </div>
      {tab === "Timeline" ? (
        <div className="two-col wide-left">
          <Panel>
            <SectionHead
              title="What the logs actually say"
              description="Source labels omit year and timezone. The assessment treats these as UTC; normalization is not independently verified."
              action={<Pill tone="neutral">9 SOURCE ENTRIES</Pill>}
            />
            <div className="event-timeline">
              {events.map((e) => (
                <div
                  className={
                    "timeline-event " + (e.severity === "WARN" ? "warning" : "")
                  }
                  id={e.id}
                  key={e.id}
                >
                  <div className="timeline-dot" />
                  <time>{e.time.replace("Sep 14 ", "")}</time>
                  <div>
                    <div>
                      <b>{e.kind.replaceAll("_", " ")}</b>
                      <Pill tone={e.channel === "Audio" ? "gold" : "neutral"}>
                        {e.channel}
                      </Pill>
                    </div>
                    <code>{e.raw}</code>
                  </div>
                  <button
                    title={"Copy evidence " + e.id}
                    aria-label={"Copy evidence " + e.id}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(e.id + ": " + e.raw)
                        .then(() => notify("Evidence " + e.id + " copied"))
                        .catch(() =>
                          notify(
                            "Clipboard unavailable; select the visible evidence text.",
                          ),
                        );
                    }}
                  >
                    {e.id} <Copy size={12} />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
          <div className="lab-side">
            <Panel>
              <SectionHead title="Facts, then questions." />
              <Pill tone="green">OBSERVED</Pill>
              <p>
                Repeated audio keepalive timeouts, a control reconnect, a
                duplicate socket, and call-stage signals.
              </p>
              <Pill tone="gold">REPORTED</Pill>
              <p>
                VPN use, intermittent reconnect banner, missing templates,
                temporary restart improvement, and an unspecified reinstall
                error.
              </p>
              <Pill tone="neutral">UNKNOWN</Pill>
              <p>
                Session correlation, ping thresholds, close codes, recording
                outcome, wider impact, exact client environment.
              </p>
            </Panel>
            <Panel>
              <h3>Audio ≠ control.</h3>
              <p>
                The audio and control channels serve different purposes. An
                audio warning alone does not establish why templates
                disappeared.
              </p>
              <button className="text-btn" onClick={() => go("architecture")}>
                Explore the architecture <ArrowRight size={15} />
              </button>
            </Panel>
          </div>
        </div>
      ) : tab === "Hypotheses" ? (
        <div className="two-col">
          <Panel>
            {hypotheses.map((h, i) => (
              <button
                key={h.name}
                className={"article-row " + (selected === i ? "selected" : "")}
                onClick={() => setSelected(i)}
              >
                <span className="icon-box">
                  <Lightbulb size={18} />
                </span>
                <span>
                  <b>{h.name}</b>
                  <small>
                    {h.team} · {statuses[i]}
                  </small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </Panel>
          <Panel>
            <Pill>PLAUSIBLE · NOT CALIBRATED PROBABILITY</Pill>
            <h2>{hypotheses[selected].name}</h2>
            <h4>Supporting observations</h4>
            <p>{hypotheses[selected].support}</p>
            <h4>Contradictions / missing evidence</h4>
            <p>{hypotheses[selected].against}</p>
            <h4>Test required</h4>
            <p>{hypotheses[selected].test}</p>
            <h4>Why this matters</h4>
            <p>{hypotheses[selected].why}</p>
            <label>
              Investigation status{" "}
              <select
                value={statuses[selected]}
                onChange={(e) => {
                  const s = e.target.value;
                  setStatuses((v) => v.map((x, i) => (i === selected ? s : x)));
                  setHistory((v) => [
                    `${hypotheses[selected].name}: marked ${s} by user (not a confirmed finding).`,
                    ...v,
                  ]);
                }}
              >
                {[
                  "Open",
                  "Test planned",
                  "Evidence requested",
                  "Deprioritized",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <p>
              <b>Impact if confirmed:</b> Route a scoped fix to{" "}
              {hypotheses[selected].team}; verify both channels before closure.
            </p>
          </Panel>
        </div>
      ) : tab === "Next diagnostic step" ? (
        <Panel>
          <SectionHead
            title="Choose the next useful question."
            description="The decision tree prioritizes missing evidence, not a predetermined diagnosis."
          />
          <h3>Do you have exact failure timestamps and connection IDs?</h3>
          <div className="button-row">
            <Button
              secondary
              onClick={() =>
                setAnswer(
                  "Request exact local occurrence times, timezone, call IDs, app/OS versions, and a consented sanitized support bundle. Without time alignment, correlation is unreliable.",
                )
              }
            >
              Not yet
            </Button>
            <Button
              onClick={() =>
                setAnswer(
                  "Correlate control and audio connection histories and close codes. Then check affected-user scope. For a single endpoint, coordinate an approved controlled network comparison with IT; for widespread impact, review server health.",
                )
              }
            >
              Yes, available
            </Button>
          </div>
          {answer && (
            <div className="notice">
              <Lightbulb size={20} />
              <p>{answer}</p>
            </div>
          )}
          <h3>Resolution criteria</h3>
          <p>
            Multiple representative calls, persistent template visibility,
            expected recording outcomes, stable ping/pong, a rollback plan,
            customer confirmation, and an agreed observation period. No fixed
            SLA is inferred.
          </p>
        </Panel>
      ) : (
        <Panel>
          <SectionHead
            title="Your session investigation history"
            description="These notes track user decisions in this browser session; they do not modify the source evidence."
          />
          {history.length ? (
            history.map((s, i) => (
              <p className="history-entry" key={i}>
                {s}
              </p>
            ))
          ) : (
            <p>
              No decisions recorded. Change a hypothesis status to begin
              tracking.
            </p>
          )}
          <Button
            secondary
            onClick={() =>
              download(
                "investigation-notes.json",
                JSON.stringify(
                  {
                    hypotheses: hypotheses.map((h, i) => ({
                      ...h,
                      status: statuses[i],
                    })),
                    history,
                  },
                  null,
                  2,
                ),
                "application/json",
              )
            }
          >
            <Download size={15} />
            Export notes
          </Button>
        </Panel>
      )}
    </>
  );
}
function Diagnostics({ notify }: { notify: (s: string) => void }) {
  const [input, setInput] = useState(sampleLog);
  const [parsed, setParsed] = useState(parseLogs(sampleLog));
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("All channels");
  const [severity, setSeverity] = useState("All severities");
  const [error, setError] = useState("");
  const [anonymize, setAnonymize] = useState(false);
  const displayed = parsed.filter(
    (e) =>
      (channel === "All channels" || e.channel === channel) &&
      (severity === "All severities" || e.severity === severity) &&
      e.raw.toLowerCase().includes(query.toLowerCase()),
  );
  const run = (text = input) => {
    try {
      setParsed(parseLogs(text));
      setError("");
      notify(
        "Parsed locally. " + parseLogs(text).length + " evidence entries.",
      );
    } catch (e) {
      setParsed([]);
      setError((e as Error).message);
    }
  };
  const safe = (s: string) =>
    anonymize
      ? s
          .replace(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, "[EMAIL]")
          .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP]")
          .replace(/(client_id\s+)\S+/gi, "$1[CLIENT]")
      : s;
  return (
    <>
      <Panel>
        <SectionHead
          title="From raw input to useful evidence"
          description="Maximum 1 MB or 10,000 lines. Uploaded text is never executed or sent to a server."
          action={
            <label className="btn secondary">
              <Upload size={15} />
              Upload log
              <input
                className="file-input"
                type="file"
                accept=".log,.txt,.json"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 1024 * 1024) {
                    setParsed([]);
                    setError("Maximum input is 1 MB.");
                    return;
                  }
                  const text = await f.text();
                  setInput(text);
                  run(text);
                }}
              />
            </label>
          }
        />
        <textarea
          className="log-input"
          aria-label="Log input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setParsed([]);
          }}
          spellCheck={false}
        />
        <div className="button-row">
          <Button onClick={() => run()}>
            <Terminal size={15} />
            Analyze logs
          </Button>
          <Button
            secondary
            onClick={() => {
              setInput(sampleLog);
              run(sampleLog);
            }}
          >
            Load exercise excerpt
          </Button>
          <label className="check-row inline">
            <input
              type="checkbox"
              checked={anonymize}
              onChange={() => setAnonymize(!anonymize)}
            />
            Anonymization preview
          </label>
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {anonymize && (
          <div className="notice">
            Preview redacts emails, IPv4 and client IDs only. Review all text
            before sharing; this is not comprehensive de-identification.
          </div>
        )}
      </Panel>
      <div className="toolbar">
        <div className="input-with-icon">
          <Search size={16} />
          <input
            aria-label="Search events"
            placeholder="Search event text…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          {["All channels", "Audio", "Control", "Call", "Unknown"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filter severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          {[
            "All severities",
            "WARN",
            "INFO",
            "ERROR",
            "DEBUG",
            "FATAL",
            "UNKNOWN",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span className="toolbar-spacer" />
        <Button
          secondary
          onClick={() =>
            download(
              "log-evidence.json",
              JSON.stringify(
                displayed.map((e) => ({ ...e, raw: safe(e.raw) })),
                null,
                2,
              ),
              "application/json",
            )
          }
        >
          <Download size={15} />
          JSON
        </Button>
        <Button
          secondary
          onClick={() =>
            download(
              "log-evidence.csv",
              toCSV(
                [
                  "Evidence",
                  "Source time",
                  "Normalized UTC",
                  "Severity",
                  "Channel",
                  "Event",
                  "Source",
                ],
                displayed.map((e) => [
                  e.id,
                  e.time,
                  e.utc,
                  e.severity,
                  e.channel,
                  e.kind,
                  safe(e.raw),
                ]),
              ),
              "text/csv",
            )
          }
        >
          CSV
        </Button>
      </div>
      <Panel>
        <SectionHead
          title={`${displayed.length} visible events`}
          description={`${parsed.filter((e) => e.kind === "audio_keepalive_timeout").length} timeout(s) · ${parsed.filter((e) => e.kind === "duplicate_socket").length} duplicate socket event(s). Counts describe the parsed input, not a confirmed diagnosis.`}
        />
        <div className="table-scroll">
          <table className="evidence-table">
            <thead>
              <tr>
                <th>Evidence</th>
                <th>Source timestamp</th>
                <th>Channel</th>
                <th>Severity</th>
                <th>Exact source / normalized time</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((e) => (
                <tr key={e.id}>
                  <td>
                    <code>{e.id}</code>
                  </td>
                  <td>{e.time}</td>
                  <td>{e.channel}</td>
                  <td>
                    <Pill tone={e.severity === "WARN" ? "gold" : "neutral"}>
                      {e.severity}
                    </Pill>
                  </td>
                  <td>
                    <code>{safe(e.raw)}</code>
                    <small>
                      {e.utc ||
                        "UTC unresolved: source lacks explicit year/timezone or timestamp is invalid"}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!displayed.length && (
            <div className="empty">No events match these filters.</div>
          )}
        </div>
      </Panel>
      <div className="notice">
        <AlertTriangle size={18} />
        <span>
          Possible causes remain unconfirmed. A missing START_CALL in an excerpt
          does not prove recording failed. Session IDs and close reasons are
          required for reliable correlation.
        </span>
      </div>
    </>
  );
}
function Copilot({ notify }: { notify: (s: string) => void }) {
  const [mode, setMode] = useState("Incident summary");
  const [reviewed, setReviewed] = useState(false);
  const texts: Record<string, string> = {
    "Incident summary":
      "OBSERVATIONS\nThree audio ping/pong timeouts appear at L1, L4, L8. A control disconnect/reconnect pair appears at L2–L3, separated by 3.203 seconds. A duplicate socket event appears at L5. One START_CALL appears at L7.\n\nHYPOTHESES\nNetwork-path interruption, endpoint/runtime delay, reconnection handling, or backend instability remain possible. No root cause is established.\n\nMISSING EVIDENCE\nConnection IDs, close codes, ping thresholds, client environment, precise symptom times, and affected-user scope.",
    "Customer update":
      "DRAFT — HUMAN REVIEW REQUIRED\nThanks for the details. We confirmed intermittent audio connection timeouts in the supplied logs [L1, L4, L8]. We have not confirmed the cause or whether the missing templates share the same trigger. We are proposing a review of both connection paths [L2–L3] and an IT-approved network comparison. Please provide two recent occurrence times with timezone and the exact reinstall error. No action has been taken by this tool.",
    "Engineering escalation":
      "DRAFT ENGINEERING HANDOFF\nImpact: reported reconnect banner and missing templates; scope unverified.\nEvidence: L1/L4/L8 audio timeouts; L2/L3 control reconnect; L5 duplicate socket; L6/L9 CHECK_START_CALL; L7 START_CALL.\nRequested investigation: correlate control/audio session IDs, expected duplicate semantics, close codes, call outcomes, and client/server version history.\nReproduction: not yet established. Root cause: unknown. No fix verified.",
    "Diagnostic checklist":
      "[ ] Obtain occurrence times and timezone.\n[ ] Confirm consent and sanitize support bundle.\n[ ] Correlate audio/control connection IDs against L1–L9.\n[ ] Obtain exact reinstall error.\n[ ] Review wider service impact.\n[ ] Coordinate approved one-variable network comparison with IT.\n[ ] Verify templates and recording across representative calls.\n[ ] Record rollback, observation window, and customer confirmation.",
  };
  return (
    <div className="two-col">
      <Panel>
        <div className="large-icon gold">
          <Sparkles />
        </div>
        <h2>
          Useful structure.
          <br />
          Honest boundaries.
        </h2>
        <p>
          This assistant formats the nine supplied log entries and assessment
          context into reviewable drafts. It uses deterministic templates and
          cannot take actions.
        </p>
        <div className="small-eyebrow">CHOOSE A DRAFT</div>
        {Object.keys(texts).map((t) => (
          <button
            key={t}
            className={"article-row " + (mode === t ? "selected" : "")}
            onClick={() => {
              setMode(t);
              setReviewed(false);
            }}
          >
            <FileText size={18} />
            <b>{t}</b>
            <ArrowRight size={15} />
          </button>
        ))}
        <Pill tone="neutral">NO LLM CONNECTED</Pill>
      </Panel>
      <Panel>
        <SectionHead
          title={mode}
          action={
            <Pill tone={reviewed ? "green" : "gold"}>
              {reviewed ? "HUMAN REVIEWED" : "DRAFT"}
            </Pill>
          }
        />
        <pre className="report-text">{texts[mode]}</pre>
        <div className="button-row">
          <Button
            secondary
            onClick={() =>
              navigator.clipboard
                .writeText(texts[mode])
                .then(() => notify("Draft copied"))
                .catch(() =>
                  notify("Clipboard unavailable. Select the visible text."),
                )
            }
          >
            <Copy size={15} />
            Copy draft
          </Button>
          <Button
            secondary
            onClick={() => download("investigation-draft.md", texts[mode])}
          >
            <Download size={15} />
            Download
          </Button>
          <Button onClick={() => setReviewed(!reviewed)}>
            <Check size={15} />
            {reviewed ? "Reopen review" : "Mark reviewed"}
          </Button>
        </div>
        <small>
          All references point to source lines in the Escalation Command Center.
          Drafts remain local.
        </small>
      </Panel>
    </div>
  );
}
interface Slide {
  id: number;
  title: string;
  headline: string;
  body: string | string[];
  notes: string;
}
function Slides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("./downloads/slide-content.json")
      .then((r) => {
        if (!r.ok) throw Error("Deck content unavailable");
        return r.json();
      })
      .then(setSlides)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight")
        setIndex((v) => Math.min(slides.length - 1, v + 1));
      if (e.key === "ArrowLeft") setIndex((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [slides.length]);
  const s = slides[index];
  return (
    <>
      <div className="toolbar">
        <Pill>15 SLIDES · SHARED CONTENT SOURCE</Pill>
        <span className="toolbar-spacer" />
        <Button secondary onClick={() => setNotes(!notes)}>
          <MessageSquare size={15} />
          {notes ? "Hide" : "Show"} notes
        </Button>
        <Button
          secondary
          onClick={() =>
            document
              .getElementById("slide-stage")
              ?.requestFullscreen()
              .catch(() =>
                setError("Fullscreen is unavailable in this browser."),
              )
          }
        >
          <Maximize2 size={15} />
          Fullscreen
        </Button>
        <a className="btn" href="./downloads/executive-deck.pptx" download>
          <Download size={15} />
          Editable PPTX
        </a>
      </div>
      {error && <p role="alert">{error}</p>}
      {s ? (
        <div className="presentation-grid">
          <div className="slide-thumbnails">
            {slides.map((x, i) => (
              <button
                key={x.id}
                onClick={() => setIndex(i)}
                className={index === i ? "selected" : ""}
              >
                <span>{String(x.id).padStart(2, "0")}</span>
                <b>{x.title}</b>
              </button>
            ))}
          </div>
          <div>
            <div className="slide-stage" id="slide-stage">
              <div className="slide-brand">
                balto <span>/ lab</span>
              </div>
              <div className="eyebrow">
                {String(s.id).padStart(2, "0")} / THE ENGINEERING STORY
              </div>
              <h2>{s.headline}</h2>
              {Array.isArray(s.body) ? (
                <ul>
                  {s.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p>{s.body}</p>
              )}
              <div className="slide-footer">
                KAZI MUSHARRAF · SOFTWARE DEVELOPER & AI ENGINEER{" "}
                <span>{index + 1} / 15</span>
              </div>
            </div>
            <div className="slide-controls">
              <Button
                secondary
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <span>
                Use ← → to navigate · Slide {index + 1} of {slides.length}
              </span>
              <Button
                secondary
                disabled={index === slides.length - 1}
                onClick={() =>
                  setIndex((i) => Math.min(slides.length - 1, i + 1))
                }
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
            <div className="progress-track">
              <i style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
            </div>
            {notes && (
              <Panel className="speaker-notes">
                <div className="small-eyebrow">SPEAKER NOTES</div>
                <p>{s.notes}</p>
              </Panel>
            )}
          </div>
        </div>
      ) : (
        <Panel>Loading presentation…</Panel>
      )}
    </>
  );
}
const files = [
  {
    title: "Technical assessment",
    desc: "Five answers, nine source entries, hypotheses, and verification criteria.",
    name: "assessment.pdf",
    type: "PDF",
    icon: FileText,
  },
  {
    title: "Company & product research",
    desc: "Public capabilities, official sources, and implementation boundaries.",
    name: "company-research.pdf",
    type: "PDF",
    icon: Compass,
  },
  {
    title: "Executive presentation",
    desc: "15 editable slides, synchronized with the web presentation.",
    name: "executive-deck.pptx",
    type: "PPTX",
    icon: Presentation,
  },
  {
    title: "Investigation workbook",
    desc: "10 editable sheets with evidence, formulas, and investigation tracking.",
    name: "incident-workbook.xlsx",
    type: "XLSX",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Architecture document",
    desc: "Channel separation, data flow, and the limits of the demonstration.",
    name: "architecture.md",
    type: "MD",
    icon: Workflow,
  },
  {
    title: "Engineering design notes",
    desc: "Implementation decisions, safety controls, and evidence handling.",
    name: "engineering-design-notes.md",
    type: "MD",
    icon: Code2,
  },
  {
    title: "Video script & narration",
    desc: "A future recording script; no rendered video is claimed.",
    name: "video-script.md",
    type: "MD",
    icon: Video,
  },
  {
    title: "NotebookLM video prompt",
    desc: "Source-grounded production instructions for an original overview.",
    name: "notebooklm-video-prompt.md",
    type: "MD",
    icon: Sparkles,
  },
  {
    title: "Product capability mapping",
    desc: "Actual capabilities mapped to bounded local demonstrations.",
    name: "company-research.md",
    type: "MD",
    icon: Compass,
  },
  {
    title: "Test evidence",
    desc: "Artifact checks and documented limits. Current app checks are in CI.",
    name: "test-evidence.md",
    type: "MD",
    icon: ShieldCheck,
  },
  {
    title: "Deployment guide",
    desc: "Local setup, build commands, and GitHub Pages publishing.",
    name: "deployment-guide.md",
    type: "MD",
    icon: GitBranch,
  },
  {
    title: "Video captions",
    desc: "Editable timed narration captions for a planned recording.",
    name: "video-captions.srt",
    type: "SRT",
    icon: MessageSquare,
  },
];
function Library() {
  const [filter, setFilter] = useState("All files");
  return (
    <>
      <div className="library-hero">
        <span className="large-icon gold">
          <FolderOpen size={28} />
        </span>
        <div>
          <h2>Good work leaves a trail.</h2>
          <p>
            Inspect the evidence, reuse the analysis, and explore the reasoning
            behind the project.
          </p>
        </div>
        <Pill>UPDATED NOV 03, 2026</Pill>
      </div>
      <div className="toolbar">
        <b>
          {
            files.filter((f) => filter === "All files" || f.type === filter)
              .length
          }{" "}
          resources
        </b>
        <span className="toolbar-spacer" />
        <select
          aria-label="Filter file type"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["All files", "PDF", "PPTX", "XLSX", "MD", "SRT"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="download-grid">
        {files
          .filter((f) => filter === "All files" || f.type === filter)
          .map((f) => (
            <Panel key={f.name}>
              <div className="feature-top">
                <span className="large-icon gold">
                  <Icon icon={f.icon} size={23} />
                </span>
                <Pill tone="neutral">{f.type}</Pill>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="file-bottom">
                <small>v2.0 · Nov 03, 2026</small>
                <a
                  href={"./downloads/" + f.name}
                  download
                  aria-label={"Download " + f.title}
                >
                  <Download size={17} />
                </a>
              </div>
            </Panel>
          ))}
      </div>
      <div className="notice">
        <FolderOpen size={18} />
        <span>
          The original website is preserved in the{" "}
          <a href="./legacy/index.html">legacy archive</a>. Source evidence:{" "}
          <a href="./data/example.log" download>
            example.log
          </a>
          . Binary artifacts are genuine files; video resources are production
          materials.
        </span>
      </div>
    </>
  );
}
const capabilities = [
  {
    name: "Agent Assist",
    workflow: "Real-time guidance, prompts, knowledge-backed answers",
    demo: "Scripted calls and context-sensitive rules",
    page: "agent-assist",
    status: "Interactive local simulation",
    complexity: "Medium",
  },
  {
    name: "Insights",
    workflow: "Understand conversation and operational patterns",
    demo: "Filterable 96-call synthetic dataset",
    page: "insights",
    status: "Synthetic analytics",
    complexity: "Medium",
  },
  {
    name: "QA / QM",
    workflow: "Score interactions and review quality",
    demo: "Weighted visible checklist and human review",
    page: "quality-assurance",
    status: "Rule-based evaluation",
    complexity: "Medium",
  },
  {
    name: "Coaching",
    workflow: "Turn coachable moments into practice",
    demo: "Session coaching checklist",
    page: "coaching",
    status: "Local coaching workflow",
    complexity: "Low",
  },
  {
    name: "Voice Agents",
    workflow: "Handle high-volume voice conversations",
    demo: "Keyword state machine; optional device speech",
    page: "voice-agents",
    status: "Educational simulator",
    complexity: "High for production",
  },
  {
    name: "Notes",
    workflow: "Summarize conversations",
    demo: "Scripted call summary and JSON export",
    page: "notes",
    status: "Deterministic summary",
    complexity: "Low",
  },
  {
    name: "Omnichannel AI",
    workflow: "Connect voice and digital experiences",
    demo: "Not connected to any external channel",
    page: "omnichannel-ai",
    status: "Research only",
    complexity: "High",
  },
  {
    name: "Integrations",
    workflow: "Connect CRM, dialers, and support systems",
    demo: "No production integrations configured",
    page: "integrations",
    status: "Research only",
    complexity: "High",
  },
];
function Products() {
  return (
    <>
      <Panel className="research-intro">
        <Pill>OFFICIAL SOURCES · ORIGINAL IMPLEMENTATION</Pill>
        <h2>
          Understand the platform.
          <br />
          Be precise about the demonstration.
        </h2>
        <p>
          Balto’s public platform brings together agent guidance, quality,
          coaching, insights, notes, voice agents, and omnichannel workflows.
          This independent project explores selected workflows using local data
          and explicit rules.
        </p>
        <div className="button-row">
          <a
            className="btn secondary"
            href="https://www.balto.ai/"
            target="_blank"
            rel="noreferrer"
          >
            Official Balto website <ExternalLink size={14} />
          </a>
          <a
            className="btn secondary"
            href="https://www.balto.ai/docs/"
            target="_blank"
            rel="noreferrer"
          >
            Documentation hub <ExternalLink size={14} />
          </a>
          <a
            className="btn secondary"
            href="./downloads/company-research.pdf"
            download
          >
            <Download size={14} />
            Research PDF
          </a>
        </div>
      </Panel>
      <Panel>
        <SectionHead
          title="Capability & implementation matrix"
          description="Official sources checked November 3, 2026. Product names do not imply parity or affiliation."
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>User workflow</th>
                <th>This project</th>
                <th>Status / limitations</th>
                <th>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((c) => (
                <tr key={c.name}>
                  <td>
                    <a
                      href="https://www.balto.ai/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.name} <ExternalLink size={11} />
                    </a>
                  </td>
                  <td>{c.workflow}</td>
                  <td>{c.demo}</td>
                  <td>{c.status}</td>
                  <td>{c.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel>
        <h3>A connected workflow</h3>
        <div className="architecture-flow">
          <span>Conversation</span>
          <ArrowRight />
          <span>Guidance & knowledge</span>
          <ArrowRight />
          <span>Quality review</span>
          <ArrowRight />
          <span>Coaching & insights</span>
        </div>
        <p>
          For integration setup, public API authentication, and softphone
          guidance, consult the{" "}
          <a href="https://www.balto.ai/docs/">official documentation hub</a>.
          This demo performs no such integrations and makes no production
          compliance claims.
        </p>
      </Panel>
    </>
  );
}
const assessmentSections = [
  {
    title: "1. What do we know?",
    body: "Reported context includes reconnect banners, missing templates, VPN use, 70/70 Mbps bandwidth, temporary improvement after restart, and an unspecified reinstall error. The nine supplied lines confirm three audio timeouts [L1, L4, L8], a control reconnect [L2–L3], a duplicate socket [L5], two CHECK_START_CALL signals [L6, L9], and one START_CALL [L7]. The excerpt does not contain a second START_CALL at 16:09:40, despite that detail in the older prose.",
  },
  {
    title: "2. What could explain it?",
    body: "VPN/proxy inspection, endpoint/runtime stalls, reconnect handling, and backend instability are plausible hypotheses. The audio timeout pattern supports investigating keepalive interruption; it does not identify the cause. Duplicate socket handling may be expected behavior. Neither bandwidth nor an isolated reconnect establishes network health or a software defect.",
  },
  {
    title: "3. How should we investigate?",
    body: "Customer: exact occurrence times and timezone, app/OS versions, screenshots, call IDs, and exact reinstall error. IT: approved VPN/network comparisons, firewall/proxy settings, endpoint security evidence. Support/Engineering: connection/session IDs, ping/pong intervals and thresholds, close codes, recording status, affected-user scope, and version history. Coordinate one variable at a time and preserve rollback.",
  },
  {
    title: "4. When is it resolved?",
    body: "Resolution requires a reproducible, evidence-supported change or a transparently unresolved state. Validate representative calls, stable keepalive behavior across both channels, template visibility, recording outcomes, and customer confirmation. Agree an observation period, check recurrence, and preserve rollback. A missing START_CALL in a partial excerpt is not proof that recording failed.",
  },
  {
    title: "5. What should the customer hear?",
    body: "“We confirmed intermittent audio-channel timeouts in the supplied logs. We have not yet confirmed the cause or whether the missing templates share the same trigger. We propose correlating both connection paths and coordinating an approved network comparison with your IT team. Please send the exact reinstall error and two occurrence times with timezone. We will agree the next update time with you.” This is a draft, not a sent communication or established SLA.",
  },
];
function Assessment({ notify }: { notify: (s: string) => void }) {
  return (
    <>
      <div className="toolbar">
        <Pill tone="neutral">INDEPENDENT TECHNICAL ASSESSMENT</Pill>
        <span className="toolbar-spacer" />
        <Button secondary onClick={() => window.print()}>
          <FileText size={15} />
          Print report
        </Button>
        <a className="btn" href="./downloads/assessment.pdf" download>
          <Download size={15} />
          Download PDF
        </a>
      </div>
      <Panel>
        <div className="eyebrow">EXECUTIVE SUMMARY</div>
        <h2>
          A connection problem.
          <br />
          An open investigation.
        </h2>
        <p>
          The exercise describes a contact-center agent whose templates
          disappear during intermittent reconnects. Audio and control
          connections must be investigated separately and then correlated. A
          long-lived connection can fail despite a healthy speed test. No
          supplied evidence proves a VPN, application, or server root cause.
        </p>
        <div className="notice">
          <AlertTriangle size={18} />
          <span>
            The source excerpt omits year and timezone. The original assessment
            uses UTC by convention. One older prose claim about a second
            START_CALL is not supported by example.log and is excluded from this
            analysis.
          </span>
        </div>
      </Panel>
      {assessmentSections.map((s, i) => (
        <details className="assessment-detail" key={s.title} open={i === 0}>
          <summary>
            <span>{s.title}</span>
            <ChevronDown size={18} />
          </summary>
          <div>
            <p>{s.body}</p>
            <button
              className="text-btn"
              onClick={() =>
                navigator.clipboard
                  .writeText(s.body)
                  .then(() => notify("Assessment section copied"))
                  .catch(() => notify("Select the visible text to copy."))
              }
            >
              <Copy size={14} />
              Copy section
            </button>
          </div>
        </details>
      ))}
      <Panel>
        <SectionHead title="Ping, pong, and what a timeout means" />
        <div className="architecture-flow">
          <span>Client sends ping</span>
          <ArrowRight />
          <span>Server / peer replies pong</span>
          <ArrowRight />
          <span>Monitor sees no reply in time</span>
          <ArrowRight />
          <span>Socket closes</span>
        </div>
        <p>
          The excerpt does not specify which peer sends ping or the configured
          timeout threshold. A monitor timeout establishes a missed expected
          keepalive, not whether the network or runtime caused it.
        </p>
        <div className="chips">
          {[
            "WebSocket: persistent bidirectional connection",
            "Control: app signaling and state",
            "Audio: conversation stream",
            "Hypothesis: testable possible explanation",
            "Correlation: shared time or identifier",
          ].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </Panel>
    </>
  );
}
function Architecture() {
  return (
    <>
      <Panel>
        <Pill>SMALL SURFACE. CLEAR BOUNDARIES.</Pill>
        <h2>
          Local by design.
          <br />
          Traceable by default.
        </h2>
        <p>
          React and TypeScript organize stateful, reusable workspaces. Vite
          produces a static build compatible with GitHub Pages; relative asset
          paths preserve subdirectory hosting. The original HTML pages are
          archived, and library.html remains a first-class entry.
        </p>
        <div className="architecture-flow">
          <span>
            <Users size={22} />
            Browser interaction
          </span>
          <ArrowRight />
          <span>
            <Code2 size={22} />
            Typed domain rules
          </span>
          <ArrowRight />
          <span>
            <FolderOpen size={22} />
            Local evidence
          </span>
          <ArrowRight />
          <span>
            <Download size={22} />
            Reviewable export
          </span>
        </div>
      </Panel>
      <div className="three-col">
        {[
          {
            icon: ShieldCheck,
            t: "Safe text, bounded input",
            p: "Logs are parsed as plain text, limited to 1 MB and 10,000 lines. React escapes content. CSV exports neutralize formula prefixes. No secrets or telemetry.",
          },
          {
            icon: Network,
            t: "Two channels, two questions",
            p: "Control signaling and audio forwarding have distinct purposes. A missed audio keepalive cannot by itself explain a control-plane symptom.",
          },
          {
            icon: GitBranch,
            t: "Verification before claims",
            p: "Domain tests cover parsing, timestamp ambiguity, state transitions, weighted QA, filters, and exports. Python preserves the original analysis workflow.",
          },
        ].map((x) => (
          <Panel key={x.t}>
            <span className="large-icon gold">
              <Icon icon={x.icon} size={24} />
            </span>
            <h3>{x.t}</h3>
            <p>{x.p}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <SectionHead title="Call lifecycle" />
        <div className="architecture-flow">
          <span>Idle</span>
          <ArrowRight />
          <span>Active ⇄ Paused</span>
          <ArrowRight />
          <span>Ended</span>
          <ArrowRight />
          <span>New simulated call</span>
        </div>
        <h3>Deliberate limitations</h3>
        <p>
          No real-time audio capture, production RAG, CRM integration,
          calibrated model confidence, backend incident telemetry, or automated
          customer actions. The investigation copilot formats deterministic
          drafts. An actual AI integration would require authorized credentials
          and a server-side secret boundary.
        </p>
        <a
          className="text-btn"
          href="./downloads/engineering-design-notes.md"
          download
        >
          Read engineering design notes <Download size={15} />
        </a>
      </Panel>
    </>
  );
}
function Coaching({ go }: { go: (s: string) => void }) {
  const [focus, setFocus] = useState("Empathy & acknowledgment");
  const [complete, setComplete] = useState(false);
  return (
    <div className="two-col">
      <Panel>
        <Pill>SIMULATED COACHING PLAN</Pill>
        <h2>Make the next conversation better.</h2>
        <p>
          Choose one skill, inspect the visible example, and practice it in the
          Agent Assist lab. Progress is a session checklist, not a measured
          employee performance score.
        </p>
        <label>
          Focus area{" "}
          <select
            value={focus}
            onChange={(e) => {
              setFocus(e.target.value);
              setComplete(false);
            }}
          >
            {[
              "Empathy & acknowledgment",
              "Identity verification",
              "Clear follow-up",
              "Evidence-based escalation",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <div className="coaching-example">
          <div className="small-eyebrow">
            PRACTICE PROMPT · {focus.toUpperCase()}
          </div>
          <h3>
            {focus === "Empathy & acknowledgment"
              ? "“I understand how frustrating that can be.”"
              : focus === "Identity verification"
                ? "“Before reviewing the account, may I verify your identity?”"
                : focus === "Clear follow-up"
                  ? "“Here is the next step, who owns it, and when we will update you.”"
                  : "“Here is what we observed, what we suspect, and what evidence is still missing.”"}
          </h3>
        </div>
        <Button onClick={() => go("agent")}>
          <Headphones size={16} />
          Practice in the lab
        </Button>
      </Panel>
      <Panel>
        <SectionHead title="One skill. One deliberate step." />
        {[
          "Read the example aloud",
          "Explain why it helps the customer",
          "Practice in a simulated call",
        ].map((s) => (
          <label className="check-row" key={s}>
            <input type="checkbox" />
            {s}
          </label>
        ))}
        <label className="check-row">
          <input
            type="checkbox"
            checked={complete}
            onChange={() => setComplete(!complete)}
          />
          I have reviewed this practice exercise
        </label>
        <Pill tone={complete ? "green" : "neutral"}>
          {complete ? "SESSION EXERCISE REVIEWED" : "READY TO PRACTICE"}
        </Pill>
        <p>
          For a quantitative review, use the QA studio’s visible weighted rules.
          No employee ranking or historical improvement is inferred.
        </p>
        <Button secondary onClick={() => go("qa")}>
          Open QA studio <ArrowRight size={15} />
        </Button>
      </Panel>
    </div>
  );
}
function VideoStudio() {
  const [scene, setScene] = useState(0);
  const scenes = [
    [
      "The product",
      "Introduce the contact-center workflow and the boundaries of this independent demonstration.",
      "Show the Executive Overview and Product Intelligence matrix.",
    ],
    [
      "The support problem",
      "Explain the reported reconnect banner and missing templates.",
      "Open the Escalation Command Center.",
    ],
    [
      "The evidence",
      "Point to three audio timeouts and the control reconnect without claiming a cause.",
      "Inspect L1, L4, L8, then L2–L3.",
    ],
    [
      "The investigation",
      "Compare hypotheses and choose a next diagnostic check.",
      "Open Hypotheses and the decision tree.",
    ],
    [
      "The working demonstration",
      "Parse logs, filter events, export evidence, then run a scripted call.",
      "Use WebSocket Diagnostics and Agent Assist.",
    ],
    [
      "The verification",
      "Explain representative calls, channel stability, customer confirmation, and unresolved questions.",
      "Open the Assessment and downloaded workbook.",
    ],
    [
      "The candidate",
      "Connect demonstrated engineering skills to the support workflow.",
      "End on About the Creator.",
    ],
  ];
  return (
    <>
      <div className="notice">
        <Video size={20} />
        <span>
          Production materials only. No final recording has been rendered or
          embedded. Captions use proposed timings.
        </span>
      </div>
      <div className="two-col">
        <Panel>
          <SectionHead title="The storyboard" />
          {scenes.map((s, i) => (
            <button
              key={s[0]}
              className={"article-row " + (scene === i ? "selected" : "")}
              onClick={() => setScene(i)}
            >
              <span className="step-number">{i + 1}</span>
              <b>{s[0]}</b>
              <ChevronRight size={16} />
            </button>
          ))}
        </Panel>
        <Panel>
          <Pill>SCENE {scene + 1} / 7</Pill>
          <h2>{scenes[scene][0]}</h2>
          <h4>Narration direction</h4>
          <p>{scenes[scene][1]}</p>
          <h4>On-screen visuals</h4>
          <p>{scenes[scene][2]}</p>
          <h4>Recording checklist</h4>
          {[
            "Keep simulation labels visible",
            "Use readable zoom and a clean cursor path",
            "Avoid notifications and private information",
            "Pause on evidence references",
          ].map((s) => (
            <label className="check-row" key={s}>
              <input type="checkbox" />
              {s}
            </label>
          ))}
          <div className="button-row">
            <a
              className="btn secondary"
              href="./downloads/video-script.md"
              download
            >
              <Download size={15} />
              Script
            </a>
            <a
              className="btn secondary"
              href="./downloads/video-captions.srt"
              download
            >
              Captions / SRT
            </a>
            <a
              className="btn secondary"
              href="./downloads/notebooklm-video-prompt.md"
              download
            >
              NotebookLM prompt
            </a>
          </div>
          <p>
            <small>
              Pronunciation: WebSocket “web socket”; UTC “you tee see”; QA “cue
              ay”. Use restrained crossfades between scenes and hold exact logs
              long enough to read.
            </small>
          </p>
        </Panel>
      </div>
    </>
  );
}
function About() {
  return (
    <>
      <Panel className="about-hero">
        <div className="profile-monogram">
          KM
          <span />
        </div>
        <div>
          <div className="eyebrow">THE THINKING BEHIND THE WORK</div>
          <h2>
            Kazi Musharraf<span className="gold-text">.</span>
          </h2>
          <h3>Software Developer & AI Engineer</h3>
          <p>
            Approximately three years of software development experience. This
            independent project connects product understanding, evidence-first
            investigation, and thoughtful implementation.
          </p>
          <a
            className="btn secondary"
            href="https://github.com/mk-knight23"
            target="_blank"
            rel="noreferrer"
          >
            GitHub profile <ArrowUpRight size={15} />
          </a>
        </div>
      </Panel>
      <SectionHead
        title="Skills, with something to inspect."
        description="The project is the evidence. No production customer outcomes or certifications are implied."
      />
      <div className="three-col">
        {[
          [
            "Frontend engineering",
            "A responsive React/TypeScript workspace with accessible controls and real state transitions.",
          ],
          [
            "Python & debugging",
            "A local analyzer and exact-source log timeline with explicit uncertainty.",
          ],
          [
            "AI-assisted development",
            "Transparent deterministic assistance, local retrieval, and responsible integration boundaries.",
          ],
          [
            "System design",
            "Separate control and audio channels, state-machine behavior, and static deployment.",
          ],
          [
            "Technical communication",
            "An assessment, editable presentation, workbook, and customer update drafts.",
          ],
          [
            "Product understanding",
            "An official-source feature matrix and original, bounded workflow demonstrations.",
          ],
        ].map(([t, p]) => (
          <Panel key={t}>
            <CheckCircle2 size={23} className="gold-text" />
            <h3>{t}</h3>
            <p>{p}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <h3>Independent by intention.</h3>
        <p>
          This portfolio is inspired by publicly documented contact-center
          capabilities. It is not affiliated with, endorsed by, or a replica of
          Balto. Product references identify the research subject; every
          interface and simulation here is an original educational
          demonstration.
        </p>
      </Panel>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
