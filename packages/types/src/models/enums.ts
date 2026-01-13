export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DEV = 'DEV',
  EMPLOYEE = 'EMPLOYEE',
  SUPERVISOR = 'SUPERVISOR',
  TRANSPORTER = 'TRANSPORTER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  SAVED = 'SAVED',
  ERROR = 'ERROR',
  DELETED = 'DELETED',
}

export enum ProductType {
  PIZZA = 'PIZZA',
  SIDE = 'SIDE',
  DRINK = 'DRINK',
}

export enum Size {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRALARGE = 'EXTRALARGE',
}

export enum ProductDietaryType {
  MEATY = 'MEATY',
  VEGGIE = 'VEGGIE',
  VEGAN = 'VEGAN',
  NEUTRAL = 'NEUTRAL',
}

export enum OrderSource {
  WEBSITE = 'WEBSITE',
  POS = 'POS',
}

export enum OrderStatus {
  DRAFT = 'DRAFT', // order created but not finalized
  PROCESSING = 'PROCESSING', // awaiting order payment confirmation
  FINALIZED = 'FINALIZED', // order confirmed, stock will be deducted
  PREPARING = 'PREPARING', // kitchen has started production
  READY = 'READY', // kitchen finished, waiting for pickup/delivery
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // driver en route (delivery only)
  COMPLETED = 'COMPLETED', // order delivered/picked up successfully
  CANCELLED = 'CANCELLED', // order cancelled before or after finalization
}

export enum OrderFulfilmentType {
  COLLECTION = 'COLLECTION',
  DELIVERY = 'DELIVERY',
}

export enum OrderPaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// export enum OrderTime {
//   NOW='NOW',
//   LATER='LATER',
// }

// export enum OrderPaymentOption {
//   CASH_STORE = 'CASH_STORE',
//   CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
//   E_CASH = 'E_CASH',
// }

// export enum OrderStage {
//   STORE = 'STORE',
//   ITEMS = 'ITEMS',
//   CHECKOUT_REVIEW = 'CHECKOUT_REVIEW',
//   CHECKOUT = 'CHECKOUT',
// }

export enum TransportVehicleType {
  MOPED = 'MOPED',
  CAR = 'CAR',
}

export enum StockMovementType {
  PURCHASE = 'PURCHASE',
  CONSUMPTION = 'CONSUMPTION',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum MeasurementUnitType {
  GRAMS = 'GRAMS',
  KILOGRAMS = 'KILOGRAMS',
  LITRES = 'LITRES',
  MILLILITRES = 'MILLILITRES',
  PIECES = 'PIECES',
}
