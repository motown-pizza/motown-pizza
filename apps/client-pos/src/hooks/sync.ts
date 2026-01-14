/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { postsUpdate } from '@repo/handlers/requests/database/posts';
import { categoriesUpdate } from '@repo/handlers/requests/database/category';
import { useStorePost } from '@repo/libraries/zustand/stores/post';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { SyncParams } from '@repo/types/sync';
import { useDebouncedCallback } from '@mantine/hooks';
import { DEBOUNCE_VALUE } from '@repo/constants/sizes';

export const useSyncPosts = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    posts,
    deleted: deletedPosts,
    setPosts,
    clearDeletedPosts,
  } = useStorePost();

  const handleSyncPosts = useDebouncedCallback(() => {
    syncFunction({
      items: posts || [],
      deletedItems: deletedPosts,
      dataStore: STORE_NAME.POSTS,
      stateUpdateFunctionDeleted: () => clearDeletedPosts(),
      stateUpdateFunction: (i) => setPosts(i),
      serverUpdateFunction: async (i, di) => await postsUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncPosts = useDebouncedCallback(
    handleSyncPosts,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (posts === undefined && deletedPosts === undefined) return;
    if (!posts?.length && !deletedPosts?.length) return;

    debounceSyncPosts();
  }, [posts, deletedPosts, debounceSyncPosts, online]);

  return { syncPosts: debounceSyncPosts };
};

export const useSyncCategories = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    categories,
    deleted: deletedCategories,
    setCategories,
    clearDeletedCategories,
  } = useStoreCategory();

  const handleSyncCategories = useDebouncedCallback(() => {
    syncFunction({
      items: categories || [],
      deletedItems: deletedCategories,
      dataStore: STORE_NAME.CATEGORIES,
      stateUpdateFunctionDeleted: () => clearDeletedCategories(),
      stateUpdateFunction: (i) => setCategories(i),
      serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
    });
  }, DEBOUNCE_VALUE);

  const debounceSyncCategories = useDebouncedCallback(
    handleSyncCategories,
    DEBOUNCE_VALUE
  );

  useEffect(() => {
    if (categories === undefined && deletedCategories === undefined) return;
    if (!categories?.length && !deletedCategories?.length) return;

    debounceSyncCategories();
  }, [categories, deletedCategories, debounceSyncCategories, online]);

  return { syncCategories: debounceSyncCategories };
};
