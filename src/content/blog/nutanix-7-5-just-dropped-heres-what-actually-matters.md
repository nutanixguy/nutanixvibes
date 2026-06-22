---
title: "Nutanix 7.5 Just Dropped – Here's What Actually Matters"
description: "So Nutanix pushed out AOS 7.5, AHV 11, and Prism Central 7.5 back in December, and honestly? There's some good stuff in here. Like, actually useful stuff—not just marketing fluff."
pubDate: 'Jan 30 2026'
categories: ["AHV", "CVM", "NGT", "Nutanix", "Prism Central"]
---
So Nutanix pushed out AOS 7.5, AHV 11, and Prism Central 7.5 back in December, and honestly? There's some good stuff in here. Like, actually useful stuff—not just marketing fluff.

Let me break down what I think is worth paying attention to.

**VM Startup Policies**

This one's been on my wish list forever. You know how it goes—cluster reboots, HA event kicks in, and suddenly your app server is trying to connect to a database that hasn't finished starting yet. Then you're scrambling to manually power things on in the right order while someone's asking why the portal is down. Now you can just tell Nutanix "bring up the DB first, then the app tier, then the web servers." Done. Should've had this years ago, but hey, I'll take it.

**Elastic VM Storage**

Okay this is kinda cool. You can now spin up a VM on one cluster but use storage from a different cluster in your PC domain. Got a cluster that's heavy on compute but light on storage sitting next to one with tons of free space? Now they can share. Not sure how often I'll use it, but it's nice to have options when capacity gets weird.

**Cross-Cluster Live Migration Got Better**

Used to be if your storage containers had different names between clusters, CCLM would just say nope. That's fixed now. You can pick your target container during migration. Small thing, big quality-of-life improvement.

**CVM Secure Access**

You can disable SSH to your CVMs and AHV hosts now via the v4 API. Security team will love it. Word of warning though—if you flip this on, cross-cluster live migration and DR live migration break. They need SSH. So maybe don't go full lockdown until you've thought that through.

**Guest Customization Actually Works Now**

They finally made guest customization profiles reusable. Set up your Windows customization once, use it across clones and templates without re-entering everything. It's the little things.

**NGT Improvements**

Nutanix Guest Tools now preserves its config when you clone a VM or deploy from a template. No more "oh right, I need to reinstall NGT on all 50 of these." Also bumped support to 2048 VMs per cluster and added some extra metrics like uptime and FQDN.

**Prism Central Backup to S3**

PC backup and restore now works with any S3-compatible object store, not just Nutanix Objects. MinIO, Wasabi, whatever you've got. More flexibility for DR planning.

**Multisite DR Replication**

Protection policies now support one source to two or three destination sites. If you're doing multi-geo DR, this simplifies things a lot. No more duct-taping multiple policies together.

**The Stuff I Skipped**

There's a ton more—UI tweaks, new v4 APIs, IPv6 support, a new Nutanix Infrastructure Manager thing for large-scale deployments. I'm not going to list all 34 Prism Central features because we'd be here all day. Check the [https://portal.nutanix.com](https://portal.nutanix.com) if you want the full rundown.

**Bottom Line**

This is a solid release. VM Startup Policies alone will save me headaches. The CCLM and DR improvements are welcome. Nothing earth-shattering, but a lot of practical stuff that makes day-to-day management easier.

If you're still on 7.3 or earlier, might be worth planning your upgrade path.
