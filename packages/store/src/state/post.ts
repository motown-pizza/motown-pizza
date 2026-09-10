'use client';

import { create } from 'zustand';
import type { PostGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type PostsValue = PostGet[] | null | undefined;

interface PostState {
  posts: PostsValue;
  deleted: PostGet[];
  setPosts: (data: PostsValue) => void;
  setDeletedPosts: (data: PostsValue) => void;
  clearPosts: () => void;
  clearDeletedPosts: () => void;
  addPost: (data: PostGet) => void;
  updatePost: (data: PostGet) => void;
  mergePosts: (data: PostGet[]) => void;
  deletePost: (data: PostGet) => void;
}

export const useStorePost = create<PostState>((set) => ({
  posts: undefined,
  deleted: [],

  setPosts: (data) => {
    set({ posts: data });
  },

  setDeletedPosts: (data) => {
    set({ deleted: data || [] });
  },

  clearPosts: () => {
    set({ posts: [] });
  },

  clearDeletedPosts: () => {
    set({ deleted: [] });
  },

  addPost: (data) => {
    set((state) => ({
      posts: [...(state.posts ?? []), data],
    }));
  },

  updatePost: (data) => {
    set((state) => ({
      posts: state.posts?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergePosts: (incomingPosts) => {
    set((state) => {
      if (!incomingPosts || incomingPosts.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.posts) {
        return { posts: incomingPosts };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingPosts.map((n) => [String(n.id), n]));

      // 1. Update existing posts in place if fields differ
      const nextPosts = state.posts.map((existing) => {
        const incoming = incomingMap.get(String(existing.id));
        if (!incoming) return existing;

        // Check if any property changed
        const isDifferent = hasChanges(existing, incoming);

        if (isDifferent) {
          hasChanged = true;
          return { ...existing, ...incoming };
        }

        // Return exact same reference if nothing changed
        return existing;
      });

      // 2. Append new posts that aren't in the store yet
      const existingIds = new Set(state.posts.map((n) => String(n.id)));
      for (const incoming of incomingPosts) {
        if (!existingIds.has(String(incoming.id))) {
          nextPosts.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { posts: nextPosts };
    });
  },

  deletePost: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      posts: state.posts?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
