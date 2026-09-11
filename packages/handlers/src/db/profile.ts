'use server';

import { db } from '@repo/db';
import { ProfileCreate } from '@repo/types';

export const profileCreateDb = async (params: ProfileCreate) => {
  try {
    const transaction = await db.$transaction(
      async (db) => {
        const profile = await db.profile.findUnique({
          where: { email: params.email || 'user@domain.com' },
        });

        if (profile) {
          const updatedProfile = profile.customized
            ? profile
            : await db.profile.update({
                where: { id: params.id },
                data: {
                  ...params,
                  updatedAt: new Date(),
                },
              });

          return { profile: updatedProfile, existed: true };
        }

        // Create the new Profile
        const newProfile = await db.profile.create({
          data: params,
        });

        return {
          profile: newProfile,
          existed: false,
        };
      },
      {
        timeout: 15000,
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create profile):', error);
    throw error;
  }
};
