---
title: "My first few weeks using Cursor as an infra guy, not a dev"
description: "I'm an infrastructure guy, not a developer. Here's what actually happened when I let Cursor's cloud agents and my bots rebuild my blog, plus the caveats."
ogImage: ../../assets/images/post-first-week-cursor-infra-guy.webp
ogImageAlt: "Server racks on a glowing platform connected by a branching line to a code editor window, with a small AI assistant orb beside it."
pubDatetime: 2026-11-04T14:00:00.000Z
updated: 2026-11-04T14:00:00.000Z
author: Jamie Terrell
tags:
  - AI
  - Cursor
  - Beginner
level: beginner
topic: Cursor
prerequisites:
  - A GitHub account and a repo you don't mind experimenting on
objectives:
  - Understand what a Cursor cloud agent is, in plain terms
  - See how a non-developer can review and merge small changes safely
  - Know a few guardrails to set before you let an agent near anything
---

So I'm not a developer. My day job is platform engineering: clusters, VDI, change windows. I can read a script and fix a YAML file, but I've never thought of myself as someone who ships code.

A few weeks ago I upgraded to a plan that covers Grok, Grok Bot and Cursor. Grok Bots had just come out, so I jumped in. This post is what I actually did with Cursor since then, written for other infra people who keep hearing about it and aren't sure where to start.

One thing up front. A lot of the work below wasn't me typing in Cursor. My Grok Bots and Cursor's cloud agents did most of the hands-on work, and I made the calls. I'll say which was which as I go.

---

### What Cursor actually is (the short version)

Cursor is an editor with an AI agent built in. The part I used most is **cloud agents**. Per [Cursor's docs](https://cursor.com/docs/cloud-agent), a cloud agent runs in an isolated VM in the cloud. It clones your repo from GitHub (or GitLab, Bitbucket or Azure DevOps), works on a separate branch, and pushes its changes back to the repo so you can review them as a pull request.

Here's how I think of it as an infra person. It's a contractor working on a cloned test box. It doesn't touch prod directly. It hands you a change request (the PR), and nothing goes live until you approve it.

A few things from the docs worth knowing before you start:

- You can start them from the desktop app, from [cursor.com/agents](https://cursor.com/agents) in a browser, from the iOS app, from Slack or Linear, by commenting `@cursor` on a GitHub PR or issue, or through the API.
- Free and Plus plans don't include them. You need Premium or higher, Teams, Enterprise, or a legacy paid plan.
- They use your plan's usage at the selected model's rate, and Cursor asks you to set a spend limit the first time you use them.
- They used to be called Background Agents, in case you see that name in older posts.

That's the docs part. Here's what happened.

---

### The first runs weren't even my blog

**The pain.** I had a couple of side projects I wanted built and no real way to build them myself.

**What I tried.** Right after I upgraded, my coder bot kicked off two cloud agents. One built the first phase of a small project called grokquest and opened a pull request, and the build and tests passed. The other built a docs sync tool, which I kept as a private repo.

**Caveat.** I didn't write any of that code, and I didn't review it line by line.

---

### Rebuilding nutanixvibes.com

**The pain.** This site was running on a theme I wasn't happy with. I wanted something that looked more techy, had a place for certifications and beginner learning paths, and still stayed simple on GitHub Pages.

**What I tried.** A couple of weeks in, my bots looked over the site read-only first: what it's built on, how it deploys, what the DNS looks like. One of them suggested staying on Astro since it already worked. The next day I picked the AstroPaper theme.

The rule I set was simple: preview branch only. Main, Pages, DNS and secrets don't change without my go. The first rebuild PR literally said "Do not merge. This is a throwaway preview." That's how I'd treat any change in my day job. Test it somewhere it can't hurt anything first.

From there the cloud agents opened PRs for the visible stuff:

- Clean out placeholder text and pages that weren't ready
- Add the hero banner, logo and post cover images
- Add a Roll Call page of other Nutanix blogs
- Rename About to About me, fold the Start here page into it, add a CV link
- Move Tags off the header and onto the search page

All of those are in the repo's PR history if you want to see what an agent-written PR looks like.

**Caveat.** I didn't write the Astro code, and I couldn't have. What I did was decide what I wanted and approve the merge.

![A person in a hoodie, seen from behind, reviewing a code diff on a monitor with a green approve check mark, while a small robot assistant floats nearby holding a document.](../../assets/images/post-first-week-cursor-infra-guy-inline-1.webp)

---

### The evening I drove the agents myself

**The pain.** My home page intro didn't sound like me.

**What I tried.** One evening I talked to the cloud agents directly instead of going through my bots. Most of those PRs were tiny, one line or one word. The home page intro alone went through four PRs in under half an hour before I landed on the welcome line I wanted.

Honestly? That's the part that made sense to me as a non-dev. I didn't need to know where the file lived. I said what I wanted the page to say, looked at it, and asked again until it was right.

The next morning I wanted to add Jeroen Tielen's blog to the Roll Call list. I asked my coder bot to pass the URL to the cloud agent and put his entry first. A few minutes later the PR was waiting for me. In honor of the late Sir Patrick Stewart, I channeled my inner Captain Picard and said, "Make it so." Merged. Done. 🖖

**Caveat.** That speed cuts both ways. On another repo of mine, a PR got merged before my coder bot had a chance to review it. Nothing broke, but that's exactly what you'd never let happen in a change window. Decide up front who merges and when.

---

### Running it locally on my Mac

**The pain.** I wanted to see the site on my own machine before anything went live.

**What I tried.** Around the same time, my security bot reviewed the plan and approved it with conditions: no install scripts, localhost only, no credentials, no new extensions. Then my coder bot cloned the repo to my Mac, started the dev server, confirmed the site loaded, and opened the project in Cursor.

**Caveat.** I approved it, but my bot did the typing. If you're doing this yourself, start with the official [Astro install docs](https://docs.astro.build/en/install-and-setup/), not a random blog (including this one).

---

### Word of warning: extensions

While I was in the middle of all this, Cursor posted a [security notice](https://cursor.com/blog/claude-code-extension-security-notice) about a malicious copy of the Claude Code extension that was in the Cursor extension marketplace for part of a day. It tried to add an attacker's SSH key and set itself up to keep running, and Cursor says uninstalling the extension may not be enough. Their post has a quick check for macOS and Windows.

I had my bot run that check read-only on my Mac. If you installed or updated extensions around then, run it yourself.

![A laptop with a terminal window, surrounded by a shield, a padlock, and a puzzle-piece extension icon with a warning sign under a magnifying glass.](../../assets/images/post-first-week-cursor-infra-guy-inline-2.webp)

So maybe don't go installing every extension you see on day one. Same as you wouldn't install random agents on a production host.

---

### One thing I'd do again: make the agent explain itself

I set a rule that any substantial change has to come with a FORJAMES.md file in the same PR. It's a plain-language write-up of what the project is, how the parts connect, why each decision was made, and what broke along the way. It's written for me, an infra guy, with infra analogies where they actually help.

If you're not a developer, this is the closest thing to a runbook you'll get. Ask for it.

One more lesson from the CV site I set up alongside this. My personal email ended up in that repo's early commit history, and cleaning it up means either starting a fresh repo or rewriting history. Set your GitHub noreply email before the first commit.

---

### Bottom Line

You don't need to be a developer to get real use out of Cursor. I didn't write the code. Cursor's cloud agents and my bots did, and I made the decisions and approved the merges. Treat it like change management: preview branch first, nothing hits main without your go, and decide who's allowed to merge. Watch your extensions, and make the agent explain what it built in plain English.

Am I an expert? Not even close. Am I hooked? Completely. Grok Bot fever is real. :-)

Docs I used:

- [Cursor cloud agents](https://cursor.com/docs/cloud-agent)
- [Cursor security notice](https://cursor.com/blog/claude-code-extension-security-notice)
- [Astro install docs](https://docs.astro.build/en/install-and-setup/)
- [nutanixvibes PR history](https://github.com/nutanixguy/nutanixvibes/pulls?q=is%3Apr)
