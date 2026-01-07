import { Prisma, StockMovement } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type StockMovementCreate = Prisma.StockMovementCreateInput;

// Type for updating a item (all fields optional except id)
export type StockMovementUpdate = Prisma.StockMovementUpdateInput;

// Type for default item (with id and no relations)
export type StockMovementGet = StockMovement;
