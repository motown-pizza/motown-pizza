import { Status, SyncStatus } from '@repo/types/models/enums';
import { StoreGet } from '@repo/types/models/store';

const now = new Date();

export const stores: StoreGet[] = [
  {
    id: '1',
    title: 'Westlands Store',
    iframe: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.364476137389!2d36.7997289464807!3d-1.2681246795167642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9de7%3A0xad2c84df1f7f2ec8!2sWestlands%2C%20Nairobi!5e0!3m2!1ssw!2ske!4v1764674872894!5m2!1ssw!2ske`,
    city: 'Nairobi',
    location: '73 Westlands Road',
    phone: '0707 000 014',
    status: Status.ACTIVE,
    sync_status: SyncStatus.SYNCED,
    created_at: now,
    updated_at: now,
  },
  {
    id: '2',
    title: 'Kileleshwa Store',
    iframe:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.299144913923!2d36.77544059648096!3d-1.2786788293463995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17536e2a239f%3A0x7a2ec1b1ec179a4f!2sKileleshwa%2C%20Nairobi!5e0!3m2!1ssw!2ske!4v1764674924322!5m2!1ssw!2ske',
    city: 'Nairobi',
    location: '24 Kileleshwa Road',
    phone: '0707 000 015',
    status: Status.ACTIVE,
    sync_status: SyncStatus.SYNCED,
    created_at: now,
    updated_at: now,
  },
  {
    id: '3',
    title: 'Riverside Store',
    iframe:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.83874455918!2d36.79095937491689!3d-1.269664498718243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1744d1f496ef%3A0xa2a048835be09d59!2sRiverside%20Dr%2C%20Nairobi!5e0!3m2!1ssw!2ske!4v1764674963338!5m2!1ssw!2ske',
    city: 'Nairobi',
    location: '781 Riverside Drive',
    phone: '0707 000 016',
    status: Status.ACTIVE,
    sync_status: SyncStatus.SYNCED,
    created_at: now,
    updated_at: now,
  },
];
