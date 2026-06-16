Project Name: [WebChef] Decision Title: [Selecting Database] Status: [Accepted] Date: [2026-06-16]

1. Context Describe the problem and constraints that required a decision.
   - Our Team was stuck on what database to use we were inbetween postgress and NoSQL but in the end we decided on using Supabase as the postgress database which will allow all of us to see and use the same database together.

2. Decision State the architectural decision clearly in one sentence.

- We will use Supabase as the postgress database for our Webchef project.

Example: “We will use SvelteKit as the primary full-stack framework for the capstone project.”

3. Rationale (Data-Based) Cite 3 specific metrics from your scorecard that justify this decision.

- We decided to use the database structure from the third Bakeoff which featured supabase. This is due to its ability to give access to each team member allowing each of us to update the database as a whole instead of using MongoDB which will only update our own personal database seperatly from a team.

Metric A: (e.g., “Our JS Bundle was 40% smaller than the nearest competitor.”)
Metric B: (e.g., “Documentation score was 5/5, which is critical for our team.”)
Metric C: (e.g., “HMR was instant, reducing friction during UI iteration.”) 4. Consequences and Risks Identify trade-offs, known risks, and how your team will mitigate them.

Example: “The biggest risk with this stack is the smaller community. We will mitigate this by relying heavily on the official Discord and keeping our dependencies minimal to avoid abandoned libraries.”

5. Alternatives Considered Briefly explain why the 2nd place stack was not selected.

- MongoDB was a close second as it is well known in our group making it easier to follow along with everyones code as is well proven as a database. In the end however we felt that using a postgress database would be better for the site along with the higher functionality Supabase has over MongoDB as a whole. We assume there is a reason as to why its called "SUPA"base after all.
