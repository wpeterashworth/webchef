# Contributing / Dev Setup

This project deploys the SvelteKit app in **`client/`** to Render (`render.yaml` →
`rootDir: client`). The whole team must use the **same pinned pnpm version** so the
committed lockfile stays stable. These steps get your branch aligned with `main`
after the deploy fixes landed.

> **The one rule that matters:** there is now a single committed
> `client/pnpm-lock.yaml`. **Adopt it — do not delete and regenerate your own.**
> Regenerating lockfiles with mismatched pnpm versions is what broke Render deploys
> in the first place. Deleting `node_modules` locally is fine; deleting the
> *committed lockfile* is not.

---

## One-time setup (per machine)

Node 24 ships with Corepack. Enable it so pnpm auto-matches the pinned version
(`pnpm@11.11.0`, read from `packageManager` in `package.json`):

```bash
corepack enable
```

Then **open a new terminal** so the pnpm shim takes effect.

---

## Aligning your feature branch with `main`

Run these from the repo root.

**1. Merge the latest `main` into your branch:**

```bash
git checkout <your-branch>
git fetch origin
git merge origin/main        # or rebase, if that's your team's convention
```

**2. Resolve the expected conflicts by taking `main`'s side.**

Your branch still has the old root files, so the merge will conflict on them.
These files were **deleted** on `main` — accept the deletion:

```bash
git rm pnpm-workspace.yaml pnpm-lock.yaml package-lock.json
```

And take `main`'s version of the client manifest + lockfile (don't hand-merge):

```bash
git checkout origin/main -- client/pnpm-lock.yaml client/package.json
```

> Only re-add a dependency afterward if *your* branch genuinely introduced a new
> one — see "Adding a dependency" below.

**3. Clear stale installs and reinstall from the committed lockfile:**

```bash
rm -rf node_modules client/node_modules
cd client
pnpm install --frozen-lockfile
```

`--frozen-lockfile` installs exactly what the lockfile says and **fails loudly if
`package.json` and the lockfile disagree**, instead of silently rewriting the
lockfile. This is the same thing Render/CI does — if it passes locally, it passes
on deploy.

**4. Verify the pin is active:**

```bash
pnpm --version    # should print 11.11.0 while inside the repo
```

**5. Confirm the build works the way Render runs it:**

```bash
# still inside client/
pnpm build        # should end with: ✓ built ... and "Wrote site to build"
```

---

## Standing rules

- **Never commit a lockfile change unless you intentionally added, removed, or
  upgraded a dependency.** If `git status` shows `client/pnpm-lock.yaml` modified
  after a plain install, something is off — investigate, don't commit it.
- **Always work from `client/` for app dependencies.** Running pnpm from the repo
  root installs against the wrong manifest (the root `package.json` only holds the
  Supabase CLI dev tool).

## Adding a dependency

```bash
cd client
pnpm add <package>            # runtime dependency
pnpm add -D <package>         # dev-only dependency
```

Then commit **both** `client/package.json` and the updated `client/pnpm-lock.yaml`
together, in the same commit.

---

## Quick reference

| Task | Command (from `client/`) |
| --- | --- |
| Install deps | `pnpm install --frozen-lockfile` |
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Preview the build | `pnpm preview` |
