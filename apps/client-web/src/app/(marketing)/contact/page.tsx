import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import IntroPage from '@repo/components/layout/intros/page';
import { Box, Grid, GridCol } from '@mantine/core';
import FormContact from '@/components/form/contact';
import { SECTION_SPACING } from '@repo/constants/sizes';

export const metadata: Metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <LayoutPage>
      <LayoutSection id="page-contact-content" padded>
        <IntroPage
          props={{
            title: 'Contact Us',
            desc: 'Reach out for any inquiries or suggestions.',
          }}
        />

        <Grid mt={SECTION_SPACING} gutter={'xl'}>
          <GridCol span={{ base: 12, md: 6 }}>
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.32390055186!2d36.682583560894884!3d-1.3032035601937948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1ssw!2ske!4v1764668149149!5m2!1ssw!2ske"
              loading="lazy"
              w={'100%'}
              h={{ base: 240, md: '100%' }}
              style={{ border: 0, borderRadius: 'var(--mantine-radius-lg)' }}
              // allowfullscreen=""
              // referrerpolicy="no-referrer-when-downgrade"
            ></Box>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <FormContact />
          </GridCol>
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}
