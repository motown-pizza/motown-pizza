'use client';

import React from 'react';
import { ActionIcon, Affix, Tooltip } from '@mantine/core';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { PHONES } from '@repo/constants';

export default function AffixWhatsApp() {
  return (
    <>
      <style>{`
        @keyframes whatsapp-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .whatsapp-bounce {
            animation: whatsapp-bounce 2s ease-in-out infinite;
          }
        }
      `}</style>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Tooltip label="Chat with us">
          <ActionIcon
            component="a"
            href={`https://wa.me/${PHONES.PHONE1.replace(/\s+/g, '')}`}
            target="_blank"
            size="xl"
            radius="xl"
            color="green"
            variant="filled"
            className="whatsapp-bounce"
            w={60}
            h={60}
          >
            <IconBrandWhatsapp size={32} />
          </ActionIcon>
        </Tooltip>
      </Affix>
    </>
  );
}
