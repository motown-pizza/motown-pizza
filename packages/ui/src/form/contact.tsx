'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  GridCol,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useFormEmailInquiry } from '@repo/hooks';
import { AnchorNextLink } from '../anchor/next-link';
import { FormValuesInquiry } from '@repo/types';

export function FormContact({
  props,
  options,
}: {
  props?: Partial<FormValuesInquiry>;
  options?: { modal?: boolean; close?: () => void; order?: boolean };
}) {
  const { form, submitted, handleSubmit } = useFormEmailInquiry(props, {
    close: options?.close,
    order: options?.order,
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(() => handleSubmit())} noValidate>
      <Grid>
        <GridCol span={{ base: 12, md: options?.modal ? 6 : undefined }}>
          <Grid>
            <GridCol span={{ base: 12, xs: 6, md: options?.modal ? 12 : undefined }}>
              <TextInput
                required
                label={options?.modal ? undefined : 'Name'}
                aria-label={options?.modal ? 'Name' : undefined}
                placeholder={`Your Name${options?.modal ? ' *' : ''}`}
                {...form.getInputProps('name')}
              />
            </GridCol>

            <GridCol span={{ base: 12, xs: 6, md: options?.modal ? 12 : undefined }}>
              <TextInput
                label={options?.modal ? undefined : 'Phone'}
                aria-label={options?.modal ? 'Phone' : undefined}
                placeholder="Your Phone"
                {...form.getInputProps('phone')}
              />
            </GridCol>
          </Grid>
        </GridCol>

        <GridCol span={{ base: 12, md: options?.modal ? 6 : undefined }}>
          {!options?.order && (
            <Grid>
              <GridCol span={12}>
                <TextInput
                  required
                  label={options?.modal ? undefined : 'Inquiry'}
                  aria-label={options?.modal ? 'Inquiry' : undefined}
                  placeholder={options?.modal ? 'Inquiry *' : 'What are you inquiring about?'}
                  {...form.getInputProps('subject')}
                />
              </GridCol>

              <GridCol span={12}>
                <Textarea
                  required
                  label={options?.modal ? undefined : 'Message'}
                  aria-label={options?.modal ? 'Message' : undefined}
                  placeholder={options?.modal ? 'Message *' : 'Write your message here...'}
                  autosize
                  minRows={2}
                  maxRows={15}
                  resize="vertical"
                  {...form.getInputProps('message')}
                />
              </GridCol>

              <GridCol span={12}>
                <Text fz={'sm'} c={'dimmed'}>
                  By submitting this form, I agree to the{' '}
                  <AnchorNextLink href="/privacy-policy" inherit fw={500}>
                    privacy policy
                  </AnchorNextLink>
                  .
                </Text>
              </GridCol>
            </Grid>
          )}
        </GridCol>

        {!options?.order && (
          <GridCol span={12}>
            <SimpleGrid cols={{ base: 1, xs: 2 }}>
              <Button
                variant="light"
                fullWidth
                type="reset"
                onClick={() => form.reset()}
                disabled={submitted}
                visibleFrom={options?.modal ? 'xs' : undefined}
              >
                Clear
              </Button>

              <Button fullWidth type="submit" loading={submitted}>
                {submitted ? 'Sending' : 'Send'}
              </Button>
            </SimpleGrid>
          </GridCol>
        )}
      </Grid>
    </Box>
  );
}
