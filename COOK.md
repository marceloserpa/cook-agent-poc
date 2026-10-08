# Todo List Application

## Project Instructions

### Mandatory lint gate

- The gate step must run `yarn lint` and check its actual exit code after each work/review iteration.
- The gate step is validation-only: do not edit code. If lint fails, return `ITERATE` and include the lint diagnostics so the next work/iterate step can fix them.
- Return `DONE` only after `yarn lint` exits successfully; do not rely on code inspection or a prior run's result.
- If lint cannot be run, do not return `DONE`; explain why in the gate output.
- The work/iterate step must address lint diagnostics and rerun `yarn lint` before handing back to review and gate.

## Agent Loop

Step: **${step}** | Iteration: ${iteration}/${maxIterations}

### Task
${prompt}

${lastMessage ? '### Previous Output\n' + lastMessage : ''}

### History
Session log: ${logFile}
Read the session log for full context from previous steps.
