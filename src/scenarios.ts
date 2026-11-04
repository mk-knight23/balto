/** Synthetic training scripts. No utterance performs an account or payment action. */
export interface ScenarioStep {
  speaker: "Agent" | "Customer";
  text: string;
  stage: string;
  suggestion: string;
  followUp?: string;
  objection?: string;
  supervisorAlert?: string;
  articleId?: string;
  sentiment?: "neutral" | "concerned" | "frustrated" | "reassured";
}

interface Scenario {
  articleId: string;
  opening: string;
  empathy: string;
  objection: string;
  response: string;
  followUp: string;
  closing: string;
  focus: RegExp;
  alert?: string;
}

const scenarios: Record<string, Scenario> = {
  "Billing dispute": {
    articleId: "KB-001",
    opening: "My bill is higher than expected. I was charged twice.",
    empathy: "I understand why an unexpected charge is concerning.",
    objection:
      "Verification is complete in this simulation. Why should I wait for a refund if the charge looks duplicated?",
    response:
      "A duplicate-looking charge needs an invoice comparison; a refund is not approved. Is the second entry pending or posted? I can outline the review process without changing your account.",
    followUp:
      "For follow-up, review the two invoice entries in your secure account and contact billing through the approved support channel if both are posted; request the review status rather than assuming a refund.",
    closing:
      "I will compare the pending and posted entries, then ask billing for the review status. I understand a refund is not confirmed.",
    focus: /invoice comparison/i,
  },
  "Cancellation request": {
    articleId: "KB-002",
    opening: "I would like to cancel my subscription.",
    empathy:
      "I respect your decision and understand that repeated retention offers can be frustrating.",
    objection:
      "Verification is complete in this simulation. Please do not make me hear a sales pitch before I can cancel.",
    response:
      "You can decline retention offers. With your permission, I can explain cancellation terms and the proposed effective date; cancellation is not completed in this demo. Would you prefer the current term end or the earliest date allowed by your terms?",
    followUp:
      "For follow-up, use the approved account channel to submit your choice and check for an effective-date confirmation before assuming the subscription has ended.",
    closing:
      "I prefer the earliest permitted date. I will submit that choice through my account and look for confirmation before treating it as cancelled.",
    focus: /cancellation terms/i,
  },
  "Insurance inquiry": {
    articleId: "KB-005",
    opening: "Can you explain what my policy covers?",
    empathy: "I understand that uncertainty about coverage can be stressful.",
    objection:
      "Verification is complete in this simulation. I only need a yes or no: will my planned treatment be covered?",
    response:
      "Coverage depends on policy terms, eligibility and exclusions; approval is not guaranteed. Which policy section would you like explained, without sharing medical details here? An uncertain coverage decision requires a licensed specialist.",
    followUp:
      "For follow-up, review the applicable coverage and exclusion sections in your secure policy portal and ask a licensed specialist for a case-specific determination before relying on coverage.",
    closing:
      "I will review the exclusions section and ask a licensed specialist for a determination. This explanation is not a coverage approval.",
    focus: /policy terms, eligibility and exclusions/i,
    alert:
      "Licensed specialist review needed for a case-specific coverage determination.",
  },
  "Customer frustration": {
    articleId: "KB-004",
    opening: "I have called three times and this is still not fixed.",
    empathy:
      "I understand how frustrating it is to repeat the same issue, and I am sorry for that experience.",
    objection:
      "Verification is complete in this simulation. Why should I explain everything a fourth time?",
    response:
      "You should not need to repeat the whole story. I can summarize the prior attempts and impact for a supervisor; a resolution is not guaranteed. What is the single most important unresolved impact? May I include that summary in an escalation request?",
    followUp:
      "For follow-up, check the escalation request through the approved support channel and confirm an owner and next update; no transfer or resolution is confirmed by this simulation.",
    closing:
      "The repeated interruption is the main impact. You may include that in the summary; I will check that an owner accepts the escalation.",
    focus: /prior attempts and impact/i,
    alert:
      "Repeated contacts and unresolved impact: prepare a concise supervisor summary with customer permission.",
  },
  "Technical troubleshooting": {
    articleId: "KB-003",
    opening: "The reconnecting banner appears and my templates disappear.",
    empathy:
      "I understand how disruptive it is when your tools disappear during a call.",
    objection:
      "Verification is complete in this simulation. A colleague says the VPN caused it; can we just switch it off?",
    response:
      "The cause is not confirmed. An audio timeout alone does not establish a control-channel failure or VPN causation. What were the exact occurrence time and timezone? Record app version and approved connection evidence; only perform a network comparison approved by your administrator.",
    followUp:
      "For follow-up, submit the timestamp, timezone and approved evidence through the secure support channel; ask engineering to correlate audio and control connection IDs before assigning a cause.",
    closing:
      "I will capture the exact time and timezone and request an approved comparison. I understand the VPN has not been established as the cause.",
    focus: /exact occurrence time and timezone/i,
    alert:
      "Escalate recurring interruptions with timestamped evidence; preserve the unknown cause.",
  },
  "Subscription renewal": {
    articleId: "KB-007",
    opening: "My subscription is ending. What are my options?",
    empathy:
      "I understand that an unexpected renewal price makes planning difficult.",
    objection:
      "Verification is complete in this simulation. If I ask for a quote, will you automatically renew me at the higher price?",
    response:
      "A quote is not consent. I can explain renewal pricing, term length and cancellation terms; renewal requires your explicit consent and is not completed here. Would you like to compare the current plan with a lower-cost option?",
    followUp:
      "For follow-up, review the written price and term through the approved account channel, then provide explicit consent only if you choose to renew; check the confirmation afterward.",
    closing:
      "I will compare the written options first. I have not consented to renewal and will check the confirmation if I decide to proceed.",
    focus: /renewal pricing, term length and cancellation terms/i,
  },
  "Payment collection": {
    articleId: "KB-006",
    opening: "I need help understanding my outstanding balance.",
    empathy:
      "I understand that discussing an outstanding balance can be stressful.",
    objection:
      "Verification is complete in this simulation. I cannot pay the whole amount today; do you need my card number now?",
    response:
      "Please do not share payment-card data here. With your consent, I can explain the balance and approved hardship review options; a payment plan is not approved. Would a human hardship review be useful? No payment is collected in this demo.",
    followUp:
      "For follow-up, contact the approved billing channel to request a hardship review, confirm available terms in writing, and use only the secure payment flow if you choose an approved option.",
    closing:
      "I would like a hardship review. I will ask billing about approved terms and will not enter card details in this training call.",
    focus: /approved hardship review options/i,
    alert:
      "Customer reports hardship: route to an authorized human reviewer without pressure.",
  },
  "Supervisor escalation": {
    articleId: "KB-004",
    opening: "I would like to speak with your supervisor.",
    empathy:
      "I understand that you want a supervisor to review the unresolved issue.",
    objection:
      "Verification is complete in this simulation. Last time I was promised a transfer and nobody answered; how is this different?",
    response:
      "I can prepare a supervisor handoff with the issue, impact and actions attempted, but a transfer is not confirmed until a supervisor accepts. May I request that handoff, and what outcome should the supervisor review?",
    followUp:
      "For follow-up, confirm that a supervisor accepts the request through the approved support channel; if unavailable, ask for the documented callback process without assuming a callback time is guaranteed.",
    closing:
      "Please request the handoff and include the missed transfer. I will wait for acceptance or the documented callback process; no transfer has happened yet.",
    focus: /supervisor handoff/i,
    alert:
      "Supervisor requested: capture permission, prior failed transfer and desired outcome; acceptance unconfirmed.",
  },
};

function getScenario(name: string): Scenario {
  return scenarios[name] ?? scenarios["Billing dispute"];
}

export function scenarioSteps(name: string): ScenarioStep[] {
  const script = getScenario(name);
  return [
    {
      speaker: "Agent",
      text: "Thank you for calling. This is Alex. This is a simulated, recorded training call.",
      stage: "Greeting",
      suggestion:
        "Introduce yourself and disclose the simulated recording before discussing the request.",
      sentiment: "neutral",
    },
    {
      speaker: "Customer",
      text: script.opening,
      stage: "Discover",
      suggestion:
        "Acknowledge this specific concern without assuming its cause or outcome.",
      sentiment: "concerned",
    },
    {
      speaker: "Agent",
      text: `${script.empathy} Before discussing account details, may I verify your identity through the approved process? Do not share sensitive details in this demonstration.`,
      stage: "Verify",
      suggestion:
        "Use approved identity verification outside this demo; never request passwords, card numbers or medical details.",
      sentiment: "neutral",
    },
    {
      speaker: "Customer",
      text: script.objection,
      stage: "Investigate",
      suggestion: `Consult ${script.articleId}; address the specific objection and ask one focused question.`,
      objection: script.objection,
      articleId: script.articleId,
      sentiment: "frustrated",
    },
    {
      speaker: "Agent",
      text: `${script.response} ${script.followUp}`,
      stage: "Resolve",
      suggestion:
        "Explain the approved next step and distinguish a request from a confirmed outcome.",
      articleId: script.articleId,
      followUp: script.followUp,
      supervisorAlert: script.alert,
      sentiment: "neutral",
    },
    {
      speaker: "Customer",
      text: script.closing,
      stage: "Wrap up",
      suggestion:
        "Review the agreed next step and uncertainty. This scripted acknowledgement does not prove a real-world resolution.",
      followUp: script.followUp,
      sentiment: "reassured",
    },
  ];
}

export interface ScenarioQARule {
  id: string;
  label: string;
  weight: number;
  description: string;
}
export interface ScenarioQAResult extends ScenarioQARule {
  pass: boolean;
  evidence: string[];
  evidenceText: string[];
}

/** Rules are transparent phrase checks, not claims of policy compliance or verification. */
export function scenarioQARules(name: string): ScenarioQARule[] {
  const { articleId } = getScenario(name);
  return [
    {
      id: "recording",
      label: "Recording disclosure",
      weight: 15,
      description: "Agent states that this is a recorded training call.",
    },
    {
      id: "verification",
      label: "Identity verification request",
      weight: 20,
      description:
        "Agent requests identity verification; this does not validate an identity.",
    },
    {
      id: "empathy",
      label: "Acknowledges the concern",
      weight: 15,
      description: "Agent explicitly acknowledges the customer's concern.",
    },
    {
      id: "scenario_guidance",
      label: "Relevant guidance",
      weight: 20,
      description: `Agent explains the scenario-specific next step reflected in ${articleId}.`,
    },
    {
      id: "follow_up",
      label: "Follow-up instructions",
      weight: 15,
      description:
        "Agent gives a follow-up instruction in the visible transcript.",
    },
    {
      id: "uncertainty",
      label: "Outcome uncertainty",
      weight: 15,
      description:
        "Agent explicitly states that the requested outcome remains unconfirmed or requires approval.",
    },
  ];
}

export function extractScenarioQA(
  name: string,
  visibleSteps: readonly ScenarioStep[],
): ScenarioQAResult[] {
  const patterns: Record<string, RegExp> = {
    recording: /recorded training call/i,
    verification: /verify your identity/i,
    empathy: /I understand|I respect your decision/i,
    scenario_guidance: getScenario(name).focus,
    follow_up: /For follow-up,/i,
    uncertainty:
      /not confirmed|not approved|not guaranteed|not completed|requires your explicit consent/i,
  };
  return scenarioQARules(name).map((rule) => {
    const matches = visibleSteps.flatMap((step, index) =>
      step.speaker === "Agent" && patterns[rule.id].test(step.text)
        ? [{ id: `T${index + 1}`, text: step.text }]
        : [],
    );
    return {
      ...rule,
      pass: matches.length > 0,
      evidence: matches.map((match) => match.id),
      evidenceText: matches.map((match) => match.text),
    };
  });
}
