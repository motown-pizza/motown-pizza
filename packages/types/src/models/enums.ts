export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DEV = 'DEV',
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

export enum PizzaSize {
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRALARGE = 'EXTRALARGE',
}

export enum PizzaType {
  MEATY = 'MEATY',
  VEGGIE = 'VEGGIE',
}

export enum OrderType {
  DELIVERY = 'DELIVERY',
  COLLECTION = 'COLLECTION',
}

export enum OrderTime {
  NOW = 'NOW',
  LATER = 'LATER',
}

export enum OrderPaymentOption {
  CASH_STORE = 'CASH_STORE',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  E_CASH = 'E_CASH',
}

export enum OrderStage {
  STORE = 'STORE',
  ITEMS = 'ITEMS',
  CHECKOUT_REVIEW = 'CHECKOUT_REVIEW',
  CHECKOUT = 'CHECKOUT',
}
