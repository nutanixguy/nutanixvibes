import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

export type ListedNeighbor = {
  id: string;
  title: string;
  filePath: string | undefined;
};

function updatedSeconds(post: CollectionEntry<"posts">): number {
  return Math.floor(
    new Date(post.data.modDatetime ?? post.data.pubDatetime).getTime() / 1000
  );
}

function toNeighbor(
  post: CollectionEntry<"posts"> | undefined
): ListedNeighbor | null {
  if (!post) return null;
  return {
    id: post.id,
    title: post.data.title,
    filePath: post.filePath,
  };
}

/**
 * Posts that belong in listings, newest update first
 * (`modDatetime` when set, otherwise `pubDatetime`).
 * Drafts, unlisted posts, and scheduled posts are removed by `postFilter()`.
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(postFilter)
    .sort((a, b) => updatedSeconds(b) - updatedSeconds(a));
}

/**
 * Previous (older) and next (newer) among listed posts only.
 * An unlisted page can still point at public neighbors. It is never one of them.
 */
export function adjacentListedPosts(
  post: CollectionEntry<"posts">,
  listedNewestFirst: CollectionEntry<"posts">[]
): { prevPost: ListedNeighbor | null; nextPost: ListedNeighbor | null } {
  const listedIndex = listedNewestFirst.findIndex(item => item.id === post.id);

  if (listedIndex >= 0) {
    return {
      prevPost: toNeighbor(listedNewestFirst[listedIndex + 1]),
      nextPost: toNeighbor(listedNewestFirst[listedIndex - 1]),
    };
  }

  const time = updatedSeconds(post);
  const nextPost = [...listedNewestFirst]
    .reverse()
    .find(item => updatedSeconds(item) > time);
  const prevPost = listedNewestFirst.find(item => updatedSeconds(item) < time);

  return {
    prevPost: toNeighbor(prevPost),
    nextPost: toNeighbor(nextPost),
  };
}
