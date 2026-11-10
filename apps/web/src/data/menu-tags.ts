export type MenuTag = 'bestseller' | 'spicy';

export const menuTags: Record<string, MenuTag[]> = {
  'Meaty MoTown': ['bestseller'],
  'Pepperoni': ['bestseller'],
  'Peri-Peri Chicken': ['spicy'],
  'BBQ Chicken & Mushroom': ['spicy'],
  'Veggie Deluxe (Spicy)': ['spicy'],
};

export function getManualTags(productTitle: string): MenuTag[] {
  return menuTags[productTitle] || [];
}
