---
title: Project Lazarus — Autonomous Recovery at the Edge
description: An engineering-report sample with requirements, flow diagram, state machine, YAML, metrics, and callout.
date: 2026-10-04
type: paper
---

## Executive Summary

Project Lazarus is a fictional recovery architecture designed to test an engineering-heavy paper on Zombee.Buzz. The system detects a degraded component, diagnoses the failure, selects a bounded recovery action, and validates the result.

### Objectives

- Detect failure without depending on the failed component.
- Prefer the least disruptive recovery action.
- Escalate only after bounded retries.
- Record enough evidence to explain what happened.
- Confirm recovery rather than assuming success.

![Autonomous recovery loop](/images/papers/lazarus-recovery.png)

*Figure 1. Five explicit recovery phases.*

## Recovery State Machine

```text
HEALTHY
  |
  | heartbeat lost
  v
DEGRADED ---- retry succeeds ----> HEALTHY
  |
  | retry budget exhausted
  v
RECOVERY
  |
  +---- validation passes --------> HEALTHY
  |
  +---- validation fails ---------> ESCALATED
```

## Example Policy

```yaml
recovery:
  heartbeat_timeout: 30s
  retry_limit: 2
  actions:
    degraded:
      - restart_service
      - validate
    persistent_failure:
      - reboot
      - validate
    unrecovered:
      - enter_advanced_recovery
      - publish_incident
```

:::caution[Bounded recovery]
A machine that endlessly reboots is not recovering; it is oscillating between failure states.
:::

## Simulated Results

| Failure | Detection | Recovery | Result |
| --- | ---: | ---: | --- |
| Service crash | 2.1 s | 8.4 s | Recovered |
| Agent hang | 31.0 s | 44.2 s | Recovered |
| Corrupt state | 30.8 s | 2 m 18 s | Escalated |
| Network loss | 5.4 s | — | Degraded safely |

## Failure Walkthrough

### Step 1 — Detect
The independent observer misses expected heartbeats and changes local posture.

### Step 2 — Diagnose
The system distinguishes loss of the application from loss of the operating environment.

### Step 3 — Recover
A policy engine selects the lowest-cost action still available under the retry budget.

### Step 4 — Validate
Recovery is not complete merely because an action executed. The original evidence source must return and remain stable.

## Open Questions

- How much state should survive recovery?
- Which evidence must be cryptographically verifiable?
- Who owns policy when local and remote instructions conflict?
- When should the system stop acting autonomously?

## Conclusion

A useful recovery architecture is defined by how well it can **detect, bound, explain, and validate** its actions.
