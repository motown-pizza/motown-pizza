'use client';

import React from 'react';
import { useFormProfile } from '@/hooks/form/profile';
import { Button, Grid, GridCol, Group, Select, TextInput } from '@mantine/core';
import {
  IconAt,
  IconLetterCase,
  IconPhone,
  IconUserCog,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ProfileGet } from '@repo/types/models/profile';
import { useMediaQuery } from '@mantine/hooks';
import { Role } from '@repo/types/models/enums';
import { capitalizeWords } from '@repo/utilities/string';

export default function Profile({
  props,
}: {
  props?: {
    defaultValues?: Partial<ProfileGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormProfile({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (props?.close) props.close();
      })}
      noValidate
    >
      <Grid gutter={mobile ? 5 : undefined}>
        <GridCol span={{ base: 12, xs: 6 }}>
          <TextInput
            required
            label={mobile ? 'First Name' : undefined}
            aria-label="First Name"
            placeholder="First Name"
            data-autofocus={
              !props?.defaultValues?.updated_at ? true : undefined
            }
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('first_name')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <TextInput
            required
            label={mobile ? 'Last Name' : undefined}
            aria-label="Last Name"
            placeholder="Last Name"
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('last_name')}
          />
        </GridCol>

        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Email' : undefined}
            aria-label="Email"
            placeholder="Email"
            leftSection={<IconAt size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            {...form.getInputProps('email')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <TextInput
            required
            label={mobile ? 'Phone' : undefined}
            aria-label="Phone"
            placeholder="Phone"
            leftSection={
              <IconPhone size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('phone')}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <Select
            required
            label={mobile ? 'Role' : undefined}
            aria-label="Role"
            placeholder="Role"
            allowDeselect={false}
            checkIconPosition="right"
            leftSection={
              <IconUserCog size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={[
              {
                value: Role.ADMIN,
                label: capitalizeWords(Role.ADMIN),
              },
              {
                value: Role.SUPERVISOR,
                label: capitalizeWords(Role.SUPERVISOR),
              },
              {
                value: Role.EMPLOYEE,
                label: capitalizeWords(Role.EMPLOYEE),
              },
              {
                value: Role.TRANSPORTER,
                label: capitalizeWords(Role.TRANSPORTER),
              },
            ]}
            {...form.getInputProps('role')}
          />
        </GridCol>

        <GridCol span={12}>
          <Group justify="end" mt={mobile ? 'xs' : undefined}>
            <Button fullWidth type="submit" loading={submitted}>
              {!props?.defaultValues?.updated_at ? 'Add' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
