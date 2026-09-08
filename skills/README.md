# Workflow Skills

This directory is the provider-neutral source for Switchback workflows. Claude
discovers it through `.claude/skills`; Codex and Gemini discover it from their
generated repository instructions.

Each skill owns one task and follows the same shape:

1. trigger and scope;
2. minimum athlete evidence;
3. relevant knowledge retrieval;
4. required analysis;
5. permitted action and verification;
6. durable memory effect.

The canonical constitution, health boundaries, evidence hierarchy, privacy
policy, and authorization rules live in `COMPANION.md`. Skills apply those rules
and must not redefine them. MCP schemas own exact tool arguments. Knowledge files
own scientific and coaching content.

| Skill | Use |
|---|---|
| `today` | Daily plan, recovery, and conditions |
| `review` | Completed-workout analysis |
| `week` | Weekly summary and progression |
| `adjust` | Adapt upcoming training |
| `build` | Build workouts or training blocks |
| `race` | Race preparation and execution |
| `nutrition` | Fueling and hydration |
| `check` | Health, recovery, and load review |
| `archive` | Activity-memory synchronization |
| `briefing` | Calendar notes |
| `why` | Evidence explanation |
| `setup` | Initial configuration |
