Project Name: WebChef | Decision Title: Select Svelte framework | Status: Accepted | Date: 2026-06-16

1. Context Describe the problem and constraints that required a decision.

Our team needed a framework or our final project. We were discussing different frameworks we have used before, and we decided that Svelte is the one we felt the most confidence in working with. Taking note of other projects, the bundle size was a big difference.

2. Decision State the architectural decision clearly in one sentence.

We will use SvelteKit as the primary full-stack framework for our final project.

3. Rationale (Data-Based) Cite 3 specific metrics from your scorecard that justify this decision.

Metric A: The JS bundle was On average smaller than the other frameworks we used.
Metric B: The team is all fairly familiar with Svelte
Metric C: SvelteKit gives us file-based routing and can even handle backend API routes itself, so we could potentially skip a separate Express server entirely and simplify the stack to SvelteKit + Postgres

Example: “The biggest risk with this stack is the smaller community. We will mitigate this by relying heavily on the official Discord and keeping our dependencies minimal to avoid abandoned libraries.”

5. Alternatives Considered Briefly explain why the 2nd place stack was not selected.

We initially considered React, but due to lack of team enthusiasm and concerns regarding the large boilerplate and reduced customizability due to the Large Boilerplate.
