# Todo List Application

## Project Instructions

### Mandatory lint, test, and coverage gate

- After each work/review iteration, the gate step must run `yarn lint` and `yarn test:coverage`, and check the actual exit code of each command.
- `yarn test:coverage` must pass all tests and enforce at least 90% line, function, branch, and statement coverage for `app/page.tsx`.
- The gate step is validation-only: do not edit code. If either command fails or coverage is below 90%, return `ITERATE` and include the failure output so the next work/iterate step can fix it.
- Return `DONE` only when both commands exit successfully and the coverage thresholds are met; do not rely on code inspection or prior command results.
- If either command cannot be run, do not return `DONE`; explain why in the gate output.
- The work/iterate step must address lint, test, and coverage failures, then rerun both commands before handing back to review and gate.

## Agent Loop

Step: **${step}** | Iteration: ${iteration}/${maxIterations}

### Task
${prompt}

${lastMessage ? '### Previous Output\n' + lastMessage : ''}

### History
Session log: ${logFile}
Read the session log for full context from previous steps.
