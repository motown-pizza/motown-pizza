-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEV', 'ADMIN', 'USER', 'EMPLOYEE', 'SUPERVISOR', 'TRANSPORTER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'SYNCED_CLIENT', 'SAVED', 'ERROR', 'DELETED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PIZZA', 'SIDE', 'DRINK', 'SOUP', 'DESSERT', 'SALAD');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRALARGE');

-- CreateEnum
CREATE TYPE "ProductDietaryType" AS ENUM ('MEATY', 'VEGGIE', 'VEGAN', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ProductDietarySubType" AS ENUM ('BEEF', 'CHICKEN', 'SAUCE');

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('WEBSITE', 'POS');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PROCESSING', 'FINALIZED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderFulfilmentType" AS ENUM ('COLLECTION', 'DELIVERY', 'DINE_IN');

-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CONFIRMED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderTime" AS ENUM ('NOW', 'LATER');

-- CreateEnum
CREATE TYPE "OrderPaymentMethod" AS ENUM ('ONLINE', 'CASH');

-- CreateEnum
CREATE TYPE "TransportVehicleType" AS ENUM ('MOPED', 'CAR');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('PURCHASE', 'CONSUMPTION', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "MeasurementUnitType" AS ENUM ('GRAMS', 'MILLILITRES');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SHCEDULED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('BOOKED', 'AVAILABLE', 'OCCUPIED');

-- CreateEnum
CREATE TYPE "TableBookingStatus" AS ENUM ('BOOKED', 'WAITING', 'RECEIVED', 'DONE');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "phone" TEXT,
    "customized" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "allow_comments" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "profile_id" TEXT,
    "category_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "dietary_class" "ProductDietaryType",
    "dietary_sub_class" "ProductDietarySubType",
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "size" "Size" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "measurement" TEXT,
    "product_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "MeasurementUnitType" NOT NULL,
    "stock_quantity" DOUBLE PRECISION NOT NULL,
    "low_stock_margin" DOUBLE PRECISION NOT NULL,
    "stockout_margin" DOUBLE PRECISION NOT NULL,
    "stock_capacity" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipie_items" (
    "id" TEXT NOT NULL,
    "quantity_needed" DOUBLE PRECISION NOT NULL,
    "unit" "MeasurementUnitType" NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipie_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "source" "OrderSource" NOT NULL,
    "order_status" "OrderStatus" NOT NULL,
    "order_payment_status" "OrderPaymentStatus" NOT NULL,
    "fulfillment_type" "OrderFulfilmentType" NOT NULL,
    "order_time" "OrderTime" NOT NULL,
    "payment_method" "OrderPaymentMethod" NOT NULL,
    "eta_estimate" TEXT,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT,
    "guest_count" INTEGER,
    "tracking_code" TEXT NOT NULL,
    "profile_id" TEXT,
    "store_id" TEXT,
    "table_booking_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "delivery_status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_date" TIMESTAMP(3),
    "scheduled_window_start" TIMESTAMP(3),
    "dispatched_at" TIMESTAMP(3),
    "estimated_delivery_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "vehicle_type" "TransportVehicleType",
    "vehicle_id" TEXT,
    "distance_km" DOUBLE PRECISION,
    "delivery_fee" DOUBLE PRECISION,
    "verfication_code" TEXT,
    "status_reason" TEXT,
    "failed_at" TIMESTAMP(3),
    "previous_delivery_id" TEXT,
    "profile_id" TEXT,
    "order_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_sale" INTEGER NOT NULL,
    "profile_id" TEXT,
    "order_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "table_number" TEXT NOT NULL,
    "seat_count" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_bookings" (
    "id" TEXT NOT NULL,
    "number_of_persons" INTEGER NOT NULL,
    "table_booking_status" "TableBookingStatus" NOT NULL DEFAULT 'WAITING',
    "table_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "profile_id" TEXT,
    "product_variant_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "profile_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "order_id" TEXT,
    "ingredient_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'SYNCED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipie_items" ADD CONSTRAINT "recipie_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipie_items" ADD CONSTRAINT "recipie_items_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_booking_id_fkey" FOREIGN KEY ("table_booking_id") REFERENCES "table_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_bookings" ADD CONSTRAINT "table_bookings_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
