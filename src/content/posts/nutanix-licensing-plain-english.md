---
title: "Nutanix Licensing in Plain English: NCI, NCM, NCP and What Starter, Pro and Ultimate Add"
description: "So you've got a Nutanix quote full of NCI, NCM and NCP line items. Here's how I'd explain what each one is, how the per-core billing works, and what each tier adds."
ogImage: ../../assets/images/post-nutanix-licensing-plain-english.webp
ogImageAlt: "A cartoon bearded man in a baseball cap and headphones scratches his head at his desk, confused by a huge printed quote and a three-tier pyramid on his monitor, with a green soda bottle beside him."
pubDatetime: 2026-11-09T14:00:00.000Z
updated: 2026-11-04T14:00:00.000Z
author: Jamie Terrell
tags:
  - Nutanix
  - Licensing
  - NCI
  - NCM
  - Beginner
level: beginner
topic: Licensing
draft: false
---

So you've got a Nutanix quote in front of you and it's full of NCI, NCM and NCP line items. If you've been around a while, you probably still think in AOS, Prism Pro and Calm, and plenty of older blog posts still use those names. Here's how I'd explain the current lineup to another admin.

Everything below is as of November 2026, pulled from Nutanix's [Cloud Platform Software Options page](https://www.nutanix.com/products/cloud-platform/software-options) and the current [NCI datasheet](https://www.nutanix.com/library/datasheets/nci). Nutanix moves things between tiers fairly often, so check both before you buy anything. I'm not covering prices. Nutanix doesn't publish them, so that's a conversation with your partner or account team.

## The three names you'll see

- NCI (Nutanix Cloud Infrastructure) is the platform itself. Storage, the AHV hypervisor, networking, data protection and Prism Central.
- NCM (Nutanix Cloud Manager) sits on top. Reporting, capacity planning, cost tracking, self-service and automation. Older posts call parts of this Prism Pro and Calm.
- NCP (Nutanix Cloud Platform) is just NCI and NCM sold together as a bundle.

Each of them comes in Starter, Pro and Ultimate. Every tier includes everything in the tier below it.

![The same cartoon man in a cap grins and points at his monitor, where three stacked colored blocks show tiers building on each other, with a lightbulb glowing above his head.](../../assets/images/post-nutanix-licensing-plain-english-inline-1.webp)

## The NCP bundle doesn't line up the way you'd expect

This one trips people up when comparing quotes. The NCP tier name doesn't match the NCI tier inside it. Per the [software options page](https://www.nutanix.com/products/cloud-platform/software-options):

| NCP tier | NCI tier inside | NCM tier inside |
| -------- | --------------- | --------------- |
| Starter  | Pro             | Pro             |
| Pro      | Ultimate        | Pro             |
| Ultimate | Ultimate        | Ultimate        |

So NCP Starter gets you NCI Pro, not NCI Starter. If one quote says "NCP Starter" and another says "NCI Starter plus NCM Starter," you're not comparing the same thing.

## How you're billed: physical cores

NCI and NCM are licensed on physical CPU cores, not vCPUs and not nodes. The [NCI datasheet](https://www.nutanix.com/library/datasheets/nci) says licensing "must cover the entire number of cores for full capacity of the cluster being licensed," so you can't license half a node.

Quick math: three nodes, each with two 12-core CPUs, is 3 × 2 × 12 = 72 cores. You license 72 cores of NCI at one tier.

A few other things worth knowing:

- NCI and NCM are term licenses, not perpetual, and they're portable across hardware platforms. The [software options page](https://www.nutanix.com/products/cloud-platform/software-options) says 1 through 5-year terms, while the [NCI datasheet](https://www.nutanix.com/library/datasheets/nci) says any duration from 6 to 60 months. Confirm the term options with your partner.
- NCI-VDI and NCI-Edge list 6 month through 5-year term options on the software options page.
- The tier is set per cluster. Per the [NCI datasheet](https://www.nutanix.com/library/datasheets/nci), "clusters with mixed licensing will default to the lowest tier."
- DR depends on the license type. NCI-Edge DR sites need separate licensing, and NCI-VDI has no extra license cost for the DR site. For regular core-based NCI, the datasheet says "Disaster Recovery sites require separate licensing." Confirm that one with your partner.
- Public cloud needs at least Pro, and you can't mix NCI licenses with legacy AOS licenses in the same cluster. Both of those come from the datasheet too.

Not everything is counted in cores, though:

| Product                       | What it's counted on                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| NUS (Files, Objects, Volumes) | Usable TiB                                                                                                      |
| NKP (Kubernetes)              | Physical cores on bare metal, or vCPUs on VMs, for worker nodes. Control plane nodes don't need licenses        |
| NCI-VDI                       | Peak concurrent user sessions, on a dedicated VDI cluster with no core-based licensing and no non-VDI workloads |
| NCI-Edge                      | Per VM, on a dedicated Edge cluster (up to 5 nodes, 25 powered-on VMs, 96GB memory per VM)                      |

One gotcha with VDI and Edge. Per the page, Advanced Replication and Security add-on features need the Ultimate edition there, so there's no Pro-plus-add-on route like regular NCI has.

## What each NCI tier gets you

I'm not going to list every row of the feature table. We'd be here all day. Here's what I'd actually pay attention to.

### Starter

The basics: AHV, snapshots and clones, compression, deduplication, async replication (RPO of one hour or more), plus Prism Central, RBAC, REST APIs, LCM and Foundation. The limits are the part that matters. Starter is capped at 12 nodes per cluster, RF2 only, node-level fault domains only, and it's on-prem only.

### Pro

Pro is where most production clusters land. It adds:

- Clusters over 12 nodes (check the Configuration Maximums on the Nutanix portal for the real ceiling)
- RF3, plus block and rack awareness
- Erasure coding (EC-X), storage QoS and VM Flash Mode
- Data-at-rest encryption and Native KMS, starting with NCI 7.3
- Cluster lockdown
- GPU and vGPU, VM-host affinity, VM-VM anti-affinity and HA guaranteed failover
- Cross-cluster live migration (per the software options page; see the note below)
- Multi-site DR and self-service restore
- Overlay networking
- NKP Starter

The encryption change is the one to notice. Both the [software options page](https://www.nutanix.com/products/cloud-platform/software-options) and the [datasheet](https://www.nutanix.com/library/datasheets/nci) say it's "Included in Pro edition starting with NCI 7.3." Nutanix's Dwayne Lessner [announced the change on LinkedIn](https://www.linkedin.com/posts/dwaynelessner_nutanix-cloud-platform-software-options-activity-7353161762319314946-81uF), and his post suggests you used to need a separate Security add-on for it. Neither official page says what the rules were before 7.3, so I'd check older posts against that. Encryption is also subject to export laws and hardware support, so confirm it applies to you.

### Ultimate

Ultimate adds the advanced DR and security pieces:

- Metro Availability, synchronous replication (RPO 0) and NearSync (RPO 1 to 15 minutes)
- Runbook automation for DR orchestration
- Microsegmentation
- EBS attach for NC2 on AWS

If you're on Pro and only need part of that, there are two add-ons. Advanced Replication covers Metro, Sync, NearSync and runbooks. The Security add-on covers microsegmentation.

Word of warning on cross-cluster live migration. Nutanix's own pages disagree: the software options page lists it under Pro, while the NCI datasheet puts it in Ultimate, or Pro with the Advanced DR add-on. If you need it, confirm the tier on your quote with your partner.

## What each NCM tier gets you

| Tier     | What it adds                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| Starter  | Reporting, dashboards, capacity forecasting, right-sizing and low-code ops automation                              |
| Pro      | Cost metering and chargeback, a self-service marketplace, single-VM blueprints, runbooks and SQL Server monitoring |
| Ultimate | Multi-VM app blueprints, approvals and scheduling, security monitoring and regulatory compliance                   |

The [software options page](https://www.nutanix.com/products/cloud-platform/software-options) has the full list.

## How I'd work through a quote

![The cartoon man in a cap sits beside a partner holding a magnifying glass, the two of them checking a printed quote marked with green check marks.](../../assets/images/post-nutanix-licensing-plain-english-inline-2.webp)

1. Count the physical cores across every node in the cluster.
2. Pick the NCI tier from what you need. RF3, EC-X, encryption or more than 12 nodes means Pro.
3. Look at DR and security. Sync, Metro or microsegmentation means Ultimate, or Pro plus an add-on.
4. Decide whether you need NCM at all. Chargeback, self-service and compliance reporting are the usual reasons.
5. If you need both, price it against NCP and remember the tier mismatch above.
6. Watch for separate meters. Every NCI tier includes 1 TiB of Files/Objects capacity. Past that, it's NUS, counted per usable TiB.

If you just want to learn the platform, you don't need to buy anything. [Community Edition](https://www.nutanix.com/products/community-edition) is free for labs.

## Bottom Line

NCI is the platform, NCM is the management layer, and NCP bundles the two, with NCP Starter giving you NCI Pro. You pay per physical core on a term subscription. Pro gets you RF3, EC-X, bigger clusters and, since 7.3, encryption. Ultimate gets you Metro, Sync and microsegmentation. All of this is as of November 2026, so check the [software options page](https://www.nutanix.com/products/cloud-platform/software-options) before you trust a quote, mine included.
