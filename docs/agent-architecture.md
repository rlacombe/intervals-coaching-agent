# Agent Architecture

Switchback separates responsibilities so that one long prompt does not carry the
entire system:

- `COMPANION.md` is the always-loaded contract: authority, constitution,
  evidence, health calibration, tool policy, memory invariants, and interaction.
- `agents/common.md` contains operations shared by every CLI harness. Provider
  adapters contain only genuine platform differences.
- `skills/` contains task procedures and minimum evidence. Claude's native skill
  path points to the same directory.
- `knowledge/` contains research, coaching frameworks, heuristics, and examples
  under a common evidence policy.
- `athlete/` contains private profile, memory, reports, and validated activity
  records.
- MCP schemas define tool interfaces. Server code validates writes, suppresses
  duplicate event creation, and reads created or updated events back.

The agent routes the request and reads one primary procedure before retrieval.
That procedure defines sufficient athlete evidence. The agent then loads only
knowledge that answers a question raised by the request or evidence. Health
triage sets the permitted action boundary; within it, the agent chooses the least
restrictive option that advances the athlete's goal.

Prompt instructions still govern judgment, retrieval selection, and prose.
Deterministic commands support routing, traced resource reads, provider
reconciliation, and transactional activity-memory synchronization. Server code
governs input validation, structured-workout parsing, calendar idempotency,
write read-back, and
activity-note schema checks. An optional trace records tool names, date ranges,
latency, and status without payload contents. Tests cover these boundaries so
failures can be attributed to retrieval, reasoning, tool use, memory, or advice.
