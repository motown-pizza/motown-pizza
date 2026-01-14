import { PostGet } from '@repo/types/models/post';
import { create } from 'zustand';
// import type { PostsRelations } from '@repo/types/models/cart';

export type PostsValue = PostGet[] | null | undefined;

interface PostsState {
  posts: PostsValue;
  deleted: PostGet[];
  setPosts: (data: PostsValue) => void;
  setDeletedPosts: (data: PostsValue) => void;
  clearPosts: () => void;
  clearDeletedPosts: () => void;
  addPost: (data: PostGet) => void;
  updatePost: (data: PostGet) => void;
  deletePost: (data: PostGet) => void;
  deletePosts: (data: PostGet[]) => void;
}

export const useStorePost = create<PostsState>((set) => ({
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

  addPost: (item) => {
    set((state) => {
      if (!state.posts) return {};

      return {
        posts: state.posts.includes(item)
          ? state.posts
          : [...state.posts, item],
      };
    });
  },

  updatePost: (data) => {
    set((state) => {
      if (!state.posts) return {};

      let changed = false;

      const updated = state.posts.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { posts: updated } : {};
    });
  },

  deletePost: (data) => {
    set((state) => {
      if (!state.posts) return {};

      const exists = state.posts.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        posts: state.posts.filter((i) => i.id !== data.id),
      };
    });
  },

  deletePosts: (data) => {
    set((state) => {
      if (!state.posts) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        posts: state.posts.filter((i) => !idsToDelete.has(i.id)),
      };
    });
  },
}));
