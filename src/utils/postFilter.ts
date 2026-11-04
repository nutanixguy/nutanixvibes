import type { CollectionEntry } from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";
import { resolveTimezone } from "./resolveTimezone";
import { isDraftPost, isUnlistedPost } from "./postVisibility";

dayjs.extend(utc);
dayjs.extend(timezone);

type ScheduleData = {
  pubDatetime: Date;
  timezone?: string;
};

/**
 * Publishing is day-granular: a post is due on its `pubDatetime` day in the
 * site (or per-post) timezone, not at a time of day. Dev shows future posts
 * so authoring can see them. Production hides them until that day.
 */
function isPublishedBySchedule(data: ScheduleData): boolean {
  if (import.meta.env.DEV) return true;

  const tz = resolveTimezone(data.timezone ?? config.site.timezone);
  const publishDay = dayjs(data.pubDatetime).tz(tz).startOf("day");
  const buildDay = dayjs().tz(tz).startOf("day");

  return !publishDay.isAfter(buildDay);
}

/**
 * Listing gate for home, `/posts/`, tags, archives, RSS, and prev/next.
 *
 * - Drafts are excluded
 * - Unlisted posts are excluded, including in dev and when they are future-dated
 * - In production, posts dated after the build day are excluded
 * - In dev, other non-draft posts stay visible
 */
export function postFilter(post: CollectionEntry<"posts">) {
  if (isDraftPost(post.data)) return false;
  if (isUnlistedPost(post.data)) return false;
  return isPublishedBySchedule(post.data);
}

/**
 * Pages to emit at `/{slug}/`.
 *
 * Drafts are not built. An unlisted post is built even when `pubDatetime` is
 * still in the future, so the URL can be previewed. That override does not
 * apply to `postFilter()`.
 */
export function shouldBuildPostPage(post: CollectionEntry<"posts">) {
  if (isDraftPost(post.data)) return false;
  if (isUnlistedPost(post.data)) return true;
  return isPublishedBySchedule(post.data);
}
