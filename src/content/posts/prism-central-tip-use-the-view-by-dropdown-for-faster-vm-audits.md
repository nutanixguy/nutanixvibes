---
title: 'Prism Central Tip: Use the "View By" Dropdown for Faster VM Audits'
description: "Most admins stick to searching or sorting in the VM list, but the View by dropdown in Nutanix Prism Central is a much faster way to spot issues."
ogImage: /assets/images/prism-central-view-by-hero.png
pubDatetime: 2026-02-16T12:00:00.000Z
updated: 2026-02-16T12:00:00.000Z
author: Jamie Terrell
tags:
  - Nutanix
  - Prism Central
  - Tips
level: beginner
topic: Prism Central
prerequisites:
  - Access to the Prism Central VM list
  - Permission to add columns and change the View by grouping
objectives:
  - Group the VM list with View by instead of only sorting it
  - Find unprotected VMs, snapshot-heavy guests, and missing categories
est_minutes: 8
quest_id: pc-view-by
---

Most admins stick to searching or sorting in the VM list, but the **View by** dropdown in [Nutanix](https://www.nutanix.com/) Prism Central is a much faster way to spot issues.

You'll find it here:

> **Compute & Storage → VMs → List View → "View by" (top-right dropdown)**

Unlike sorting, **View by reorganizes the entire VM list into grouped sections**, turning a simple table into a quick operational dashboard.

---

### What It's Good For

This feature helps you answer common operational questions in seconds:

- Which VMs are not protected by backup or DR policies
- Where snapshot storage is being consumed
- Which VMs are missing required categories/tags
- Whether compliance settings (encryption, RF, etc.) are consistent

---

### Built-In Views Worth Using

#### Data Protection (Most Useful)

Groups VMs by **protection policy** and clearly highlights unprotected systems.

**Great for:**

- Finding newly deployed VMs missing DR
- Spotting legacy workloads outside policy

#### Storage Configuration

Groups VMs by:

- Replication Factor (RF)
- Encryption
- Compression
- Storage policy

**Useful for:**

- Compliance checks
- Identifying inconsistent storage settings

---

### Quick Custom Checks

These aren't built-in views, but they're fast to create.

#### Snapshot Usage

**How to check:**

- Add Snapshot Count or Snapshot Usage column
- Sort descending

**Why it matters:** Quickly identifies VMs consuming excessive snapshot storage.

#### CPU Ready Time

**How to check:**

- Add CPU Ready Time column
- Sort high → low

**Why it matters:** Helps detect CPU contention and oversubscription before users report performance issues.

#### Missing Categories / Tags

**How to check:**

- Add the Categories column
- Or filter by missing category keys

**Why it matters:** Untagged VMs can break:

- Flow policies
- Automation workflows
- Chargeback tracking

---

### Suggested Routine Checks

#### Weekly

- CPU Ready Time
- Snapshot usage

#### Monthly

- Protection status
- Category compliance

#### Quarterly

- Storage configuration audit

---

### Key Takeaway

The **View by** dropdown turns the VM list from a flat table into a powerful **audit dashboard**. Using it regularly helps you catch protection gaps, resource issues, and compliance drift — all without running reports.
