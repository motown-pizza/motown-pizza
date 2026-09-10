import { db } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';
import { SyncStatus } from '@repo/types';
import { STORE_NAME } from '@repo/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const stores = request.nextUrl.searchParams.get('stores');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Parse the requested stores into an array
    const requestedStores = stores ? stores.split(',') : [];

    // 2. Define the Query Map
    const queryMap: Record<string, () => any> = {
      [STORE_NAME.CATEGORIES]: () => db.category.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.CART_ITEMS]: () => db.cartItem.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.DELIVERIES]: () => db.delivery.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.INGREDIENTS]: () => db.ingredient.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.ORDERS]: () => db.order.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.ORDER_ITEMS]: () => db.orderItem.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.PRODUCTS]: () => db.product.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.PRODUCT_VARIANTS]: () =>
        db.productVariant.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.PROFILES]: () => db.profile.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.RECIPIE_ITEMS]: () => db.recipieItem.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.STOCK_MOVEMENTS]: () =>
        db.stockMovement.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.TABLES]: () => db.table.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.TABLE_BOOKINGS]: () =>
        db.tableBooking.findMany({ orderBy: { createdAt: 'desc' } }),
      [STORE_NAME.WISHLIST_ITEMS]: () =>
        db.wishlistItem.findMany({ orderBy: { createdAt: 'desc' } }),
    };

    // 3. Extract only valid keys and keep their execution functions paired
    const validQueries = requestedStores.filter((key) => !!queryMap[key]);

    const activeQueries = validQueries.map((key) => queryMap[key]());

    // 4. Execute the transaction
    const results = await db.$transaction(activeQueries, {
      maxWait: 10000,
      timeout: 15000,
    });

    // 5. Format into a clean object using the VALID keys array so indices match 1:1
    const responsePayload = validQueries.reduce(
      (acc, key, index) => {
        acc[key] = results[index];
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(responsePayload, {
      status: 200,
      statusText: 'App Data Fetched',
    });
  } catch (error) {
    console.error('---> route handler error (get app data):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const PRISMA_MODEL_MAP: Record<string, any> = {
  [STORE_NAME.CATEGORIES]: db.category,
  [STORE_NAME.CART_ITEMS]: db.cartItem,
  [STORE_NAME.DELIVERIES]: db.delivery,
  [STORE_NAME.INGREDIENTS]: db.ingredient,
  [STORE_NAME.ORDERS]: db.order,
  [STORE_NAME.ORDER_ITEMS]: db.orderItem,
  [STORE_NAME.PRODUCTS]: db.product,
  [STORE_NAME.PRODUCT_VARIANTS]: db.productVariant,
  [STORE_NAME.PROFILES]: db.profile,
  [STORE_NAME.RECIPIE_ITEMS]: db.recipieItem,
  [STORE_NAME.STOCK_MOVEMENTS]: db.stockMovement,
  [STORE_NAME.TABLES]: db.table,
  [STORE_NAME.TABLE_BOOKINGS]: db.tableBooking,
  [STORE_NAME.WISHLIST_ITEMS]: db.wishlistItem,
};

const SYNC_PRIORITY: Record<string, number> = {
  [STORE_NAME.PROFILES]: 1,
  [STORE_NAME.CATEGORIES]: 2,
  [STORE_NAME.PRODUCTS]: 3,
  [STORE_NAME.PRODUCT_VARIANTS]: 4,
  [STORE_NAME.INGREDIENTS]: 5,
  [STORE_NAME.RECIPIE_ITEMS]: 6,
  [STORE_NAME.TABLES]: 7,
  [STORE_NAME.TABLE_BOOKINGS]: 8,
  [STORE_NAME.ORDERS]: 9,
  [STORE_NAME.ORDER_ITEMS]: 10,
  [STORE_NAME.WISHLIST_ITEMS]: 11,
  [STORE_NAME.CART_ITEMS]: 12,
  [STORE_NAME.DELIVERIES]: 13,
};

export async function POST(request: NextRequest) {
  try {
    const storesParam = request.nextUrl.searchParams.get('stores');
    // Parse the requested stores into an array
    const rawStores = storesParam ? storesParam.split(',') : [];

    // SORT HERE: Ensure the API dictates the execution order
    const requestedStores = rawStores.sort((a, b) => {
      return (SYNC_PRIORITY[a] || 99) - (SYNC_PRIORITY[b] || 99);
    });

    // Parse the body ONCE
    const fullPayload = await request.json();

    const allOperations: any[] = [];
    const storeRanges: Record<string, { start: number; end: number }> = {};

    // Build a single flat array of Prisma promises
    requestedStores.forEach((key) => {
      const model = PRISMA_MODEL_MAP[key]; // Get the correct model accessor
      const data = fullPayload[key];
      const { upserts: itemsToUpsert = [], deletedIds = [] } = data;

      if (!data || !model) {
        console.error(`No model found for key: ${key}`);
        return;
      }

      const startIdx = allOperations.length;

      // Handle Soft Deletions
      if (deletedIds?.length) {
        allOperations.push(
          model.updateMany({
            where: { id: { in: deletedIds } },
            data: {
              syncStatus: SyncStatus.DELETED, // Ensure this matches your SyncStatus enum string
              updatedAt: new Date(), // Critical: must be "now" to override other devices
            },
          }),
        );
      }

      // Handle Upserts
      const upserts = (itemsToUpsert || []).map((item: any) =>
        model.upsert({
          where: { id: item.id },
          update: {
            ...item,
            updatedAt: new Date(item.updatedAt),
          },
          create: {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          },
        }),
      );

      allOperations.push(...upserts);
      storeRanges[key] = { start: startIdx, end: allOperations.length };
    });

    // Execute everything in ONE transaction
    const flatResults = await db.$transaction(allOperations);

    // Map the flat results back to the store keys
    const responsePayload = requestedStores.reduce(
      (acc, key) => {
        const range = storeRanges[key];
        if (range) {
          const rawResults = flatResults.slice(range.start, range.end);
          // Filter out the 'updateMany' result (which is usually { count: x })
          // and keep the upsert results
          acc[key] = rawResults.filter(
            (res) => res && typeof res === 'object' && !res.hasOwnProperty('count'),
          );
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(
      { items: responsePayload },
      {
        status: 200,
        statusText: 'App Data Updated',
      },
    );
  } catch (error) {
    console.error('---> route handler error (update app data):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
