# Contributing / Dev Setup

This project deploys the SvelteKit app in **`client/`** to Render (`render.yaml` →
`rootDir: client`). The whole team must use the **same pinned pnpm version** so the
committed lockfile stays stable.

**New here / catching up after the deploy fix?** Do these two sections in order:
[One-time setup](#one-time-setup-per-machine), then
[Getting onto the deploy fix](#getting-onto-the-deploy-fix-do-this-once). After that,
[Staying in sync with `main`](#staying-in-sync-with-main-ongoing) is your day-to-day
habit.

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

> Corepack is necessary but **not sufficient** — it only decides *which pnpm runs*.
> You still need to pull the fixed branch and refresh your install (next section).

---

## Getting onto the deploy fix (do this once)

**For most teammates: your branch has already been aligned with `main` and pushed
for you, so you don't need to merge or resolve anything — just pull and reinstall.**

**1. Pull the fixed branch:**

```bash
git checkout <your-branch>
git pull
```

This fast-forwards your local branch to the already-merged fix. If you have your own
uncommitted work, run `git stash` first, then `git stash pop` after the pull.

**2. Do one clean reinstall** (your old `node_modules` was built by the old pnpm):

```bash
rm -rf node_modules client/node_modules
cd client
pnpm install --frozen-lockfile
```

This is a one-time reset. After it, a plain `pnpm install` is fine day to day.

**3. Verify:**

```bash
pnpm --version    # should print 11.11.0 while inside the repo
pnpm build        # from client/ — should end with "Wrote site to build"
```

### If a pull or checkout complains about untracked files

You may see *"untracked working tree files would be overwritten"* or a stray root
`pnpm-lock.yaml` / `package-lock.json`. That's leftover cruft from before the fix.
**Only if `git status` shows the file as untracked (`??`)**, delete it and retry:

```bash
git status --short        # confirm the file is marked ??  (untracked)
rm pnpm-lock.yaml         # remove ONLY the untracked leftover, never tracked work
```

---

## Staying in sync with `main` (ongoing)

Pull `main` into your branch **at the start of each work session** and **again right
before you push or open a PR**. Frequent small merges beat rare giant ones.

```bash
git checkout <your-branch>   # make sure you're on YOUR branch, not main
git fetch origin             # download the latest
git merge origin/main        # merge main INTO your branch
```

If that merge changed `client/package.json` or the lockfile, resync deps:

```bash
cd client
pnpm install --frozen-lockfile
```

Because pnpm is now pinned, pulling `main` will **not** churn the lockfile anymore.

> **One-way rule:** only ever merge **`main` → your branch**. Getting *your* work
> into `main` goes through a pull request (or the `Team-merge` branch) — never a
> direct push to `main`.

---

## Aligning a branch manually (fallback)

You normally won't need this — your branch was already aligned for you. Use it only
if you're on a branch that was **never** merged with the fix. Run from the repo root.

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
