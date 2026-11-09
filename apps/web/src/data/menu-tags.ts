export type MenuTag = 'bestseller' | 'spicy';

export const menuTags: Record<string, MenuTag[]> = {};

export function getManualTags(productTitle: string): MenuTag[] {
  return menuTags[productTitle] || [];
}
