import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  LocateFixed,
  Sparkles,
} from "lucide-react";
import { glossary, guideStepIndex, pageGuides } from "./visitor-guides";

type PageGuideProps = {
  pageId: string;
  onNavigate: (id: string) => void;
  onExplain?: () => void;
};

/** Scrolls and focuses only; never invokes the highlighted control's action. */
export function PageGuide({ pageId, onNavigate, onExplain }: PageGuideProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [term, setTerm] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => {
    setOpen(false);
    setActive(0);
    setTerm(null);
    setFeedback("");
    return () => cleanup.current?.();
  }, [pageId]);
  const guide = pageGuides[pageId];
  if (!guide) return null;
  const index = guideStepIndex(active, guide.steps.length);
  const current = guide.steps[index];
  const showControl = () => {
    cleanup.current?.();
    const target = document.querySelector<HTMLElement>(current.selector);
    if (!target) {
      setFeedback(
        "This control is not visible in the current view. Follow the step's instruction first, then try again. You can also use the controls below this guide directly.",
      );
      return;
    }
    for (
      let ancestor: HTMLElement | null = target;
      ancestor;
      ancestor = ancestor.parentElement
    ) {
      if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
    }
    const focusTarget = target;
    const oldTabIndex = focusTarget.getAttribute("tabindex");
    if (
      !focusTarget.matches(
        "button, a[href], input, select, textarea, summary, [tabindex]",
      )
    )
      focusTarget.setAttribute("tabindex", "-1");
    target.classList.add("guide-target");
    target.scrollIntoView({
      behavior:
        document.documentElement.dataset.effects === "off" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      block: "center",
    });
    focusTarget.focus({ preventScroll: true });
    cleanup.current = () => {
      target.classList.remove("guide-target");
      if (oldTabIndex === null) focusTarget.removeAttribute("tabindex");
      else focusTarget.setAttribute("tabindex", oldTabIndex);
    };
    setFeedback(
      `Highlighted: ${current.title}. The control has not been activated; try it when you are ready.`,
    );
  };
  const changeStep = (next: number) => {
    cleanup.current?.();
    cleanup.current = null;
    setActive(guideStepIndex(next, guide.steps.length));
    setFeedback("");
  };
  const selectedTerm = glossary.find((entry) => entry.term === term);
  return (
    <section
      className="pg-guide"
      aria-label={`How to use ${guide.simpleTitle}`}
    >
      <div className="pg-intro">
        <span className="pg-icon" aria-hidden="true">
          <Compass size={23} />
        </span>
        <div>
          <span className="pg-eyebrow">WHAT IS THIS PAGE?</span>
          <p className="pg-purpose">{guide.purpose}</p>
        </div>
      </div>
      <p className="pg-outcome">
        <Check size={16} aria-hidden="true" />
        <span>
          <strong>You can:</strong> {guide.outcome}
        </span>
      </p>
      <div className="pg-quickstart">
        <span className="pg-eyebrow">TRY THESE THREE THINGS</span>
        <ol>
          {guide.steps.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => {
                  changeStep(i);
                  setOpen(true);
                }}
              >
                <span aria-hidden="true">{i + 1}</span>
                {item.title}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <details
        className="pg-details"
        open={open}
        onToggle={(event) => {
          setOpen(event.currentTarget.open);
          if (!event.currentTarget.open) cleanup.current?.();
        }}
      >
        <summary>
          <BookOpen size={17} aria-hidden="true" /> Walk me through it{" "}
          <span className="pg-summary-hint">Step-by-step help</span>
        </summary>
        <div className="pg-walkthrough">
          <div className="pg-step-count">
            STEP {index + 1} OF {guide.steps.length}
          </div>
          <h3>{current.title}</h3>
          <p>{current.instruction}</p>
          <p className="pg-result">
            <strong>What to expect:</strong> {current.result}
          </p>
          <div className="pg-controls">
            <button type="button" onClick={showControl}>
              <LocateFixed size={16} aria-hidden="true" /> Show this control
            </button>
            <button
              type="button"
              disabled={index === 0}
              onClick={() => changeStep(index - 1)}
            >
              <ArrowLeft size={15} aria-hidden="true" /> Back
            </button>
            <button
              type="button"
              disabled={index === guide.steps.length - 1}
              onClick={() => changeStep(index + 1)}
            >
              Next <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
          <p className="pg-feedback" role="status">
            {feedback}
          </p>
        </div>
      </details>
      <details className="pg-details pg-boundary">
        <summary>
          <Sparkles size={16} aria-hidden="true" /> What is real, and what is a
          demo?
        </summary>
        <p>{guide.boundary}</p>
      </details>
      <details className="pg-details pg-glossary">
        <summary>
          <BookOpen size={16} aria-hidden="true" /> Explain an unfamiliar word
        </summary>
        <div className="pg-terms">
          {glossary.map((entry) => (
            <button
              type="button"
              key={entry.term}
              aria-pressed={term === entry.term}
              onClick={() => setTerm(entry.term)}
            >
              {entry.term}
            </button>
          ))}
        </div>
        <p className="pg-definition" role="status">
          {selectedTerm ? (
            <>
              <strong>{selectedTerm.term}:</strong> {selectedTerm.definition}
            </>
          ) : (
            "Choose a word above to see a plain-language explanation."
          )}
        </p>
      </details>
      <div className="pg-links">
        {pageId !== "overview" && (
          <button type="button" onClick={() => onNavigate("overview")}>
            <Compass size={15} aria-hidden="true" /> Back to Start here
          </button>
        )}
        {onExplain && (
          <button type="button" onClick={onExplain}>
            Open the site introduction{" "}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
