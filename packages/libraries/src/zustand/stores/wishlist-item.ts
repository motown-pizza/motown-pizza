import { WishlistItemGet } from '@repo/types/models/wishlist-item';
import { create } from 'zustand';
// import type { WishlistItemsRelations } from '@repo/types/models/wishlist';

export type WishlistItemsValue = WishlistItemGet[] | null | undefined;

interface WishlistItemsState {
  wishlistItems: WishlistItemsValue;
  deleted: WishlistItemGet[];
  setWishlistItems: (data: WishlistItemsValue) => void;
  setDeletedWishlistItems: (data: WishlistItemsValue) => void;
  clearWishlistItems: () => void;
  clearDeletedWishlistItems: () => void;
  addWishlistItem: (data: WishlistItemGet) => void;
  updateWishlistItem: (data: WishlistItemGet) => void;
  deleteWishlistItem: (data: WishlistItemGet) => void;
  deleteWishlistItems: (data: WishlistItemGet[]) => void;
}

export const useStoreWishlistItem = create<WishlistItemsState>((set) => ({
  wishlistItems: undefined,
  deleted: [],

  setWishlistItems: (data) => {
    set({ wishlistItems: data });
  },

  setDeletedWishlistItems: (data) => {
    set({ deleted: data || [] });
  },

  clearWishlistItems: () => {
    set({ wishlistItems: [] });
  },

  clearDeletedWishlistItems: () => {
    set({ deleted: [] });
  },

  addWishlistItem: (item) => {
    set((state) => {
      if (!state.wishlistItems) return {};

      return {
        wishlistItems: state.wishlistItems.includes(item)
          ? state.wishlistItems
          : [...state.wishlistItems, item],
      };
    });
  },

  updateWishlistItem: (data) => {
    set((state) => {
      if (!state.wishlistItems) return {};

      let changed = false;

      const updated = state.wishlistItems.map((i) => {
        if (i.id === data.id) {
          changed = true;
          return data; // replace
        }

        return i;
      });

      return changed ? { wishlistItems: updated } : {};
    });
  },

  deleteWishlistItem: (data) => {
    set((state) => {
      if (!state.wishlistItems) return {};

      const exists = state.wishlistItems.find((i) => i.id === data.id);
      if (!exists) return {};

      return {
        deleted: [...state.deleted, data],
        wishlistItems: state.wishlistItems.filter((i) => i.id !== data.id),
      };
    });
  },

  deleteWishlistItems: (data) => {
    set((state) => {
      if (!state.wishlistItems) return {};

      const idsToDelete = new Set(data.map((i) => i.id));

      return {
        deleted: [...state.deleted, ...data],
        wishlistItems: state.wishlistItems.filter(
          (i) => !idsToDelete.has(i.id)
        ),
      };
    });
  },
}));
