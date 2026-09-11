'use client';

import React from 'react';
import { useFormProfile } from '@repo/hooks';
import {
  Button,
  Card,
  Divider,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Radio,
  RadioGroup,
  Select,
  TextInput,
} from '@mantine/core';
import { IconAt, IconLetterCase, IconPhone, IconUserCog } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { ProfileGet } from '@repo/types';
import { useMediaQuery } from '@mantine/hooks';
import { Role, Status } from '@repo/types';
import { capitalizeWords } from '@repo/utils';
import Link from 'next/link';

export function FormStoresProfile({
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
      <Card bg={'var(--mantine-color-body)'} shadow="xs" pt={'xs'}>
        <Grid>
          <GridCol span={8}>
            <Fieldset legend="Basic user information">
              <Grid gap={mobile ? 5 : undefined}>
                <GridCol span={{ base: 12, xs: 6 }}>
                  <TextInput
                    required
                    label="First Name"
                    placeholder="First Name"
                    data-autofocus={!props?.defaultValues?.updatedAt ? true : undefined}
                    leftSection={<IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('firstName')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <TextInput
                    required
                    label="Last Name"
                    placeholder="Last Name"
                    leftSection={<IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('lastName')}
                  />
                </GridCol>

                <GridCol span={12}>
                  <TextInput
                    required
                    label="Email"
                    placeholder="Email"
                    leftSection={<IconAt size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('email')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <TextInput
                    required
                    label="Phone"
                    placeholder="Phone"
                    leftSection={<IconPhone size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                    {...form.getInputProps('phone')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <Select
                    required
                    label="Role"
                    placeholder="Role"
                    allowDeselect={false}
                    checkIconPosition="right"
                    leftSection={<IconUserCog size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
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
              </Grid>
            </Fieldset>
          </GridCol>

          <GridCol span={4}>
            <Grid>
              <GridCol span={12}>
                <Fieldset legend="User status">
                  <RadioGroup
                    name="user-status"
                    label="Select the user's current status"
                    description="This determines the user's visibility to users"
                    required
                    {...form.getInputProps('status')}
                  >
                    <Group mt="xs">
                      <Radio value={Status.DRAFT} label={capitalizeWords(Status.DRAFT)} />
                      <Radio value={Status.INACTIVE} label={capitalizeWords(Status.INACTIVE)} />
                      <Radio value={Status.ACTIVE} label={capitalizeWords(Status.ACTIVE)} />
                    </Group>
                  </RadioGroup>
                </Fieldset>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={12} mt={'md'}>
            <Group mt={mobile ? 'xs' : undefined}>
              <Button
                color="gray"
                loading={submitted}
                component={Link}
                href={`/dashboard/people/${form.values.role?.toLowerCase()}s`}
              >
                Cancel
              </Button>

              <Group display={form.isDirty() ? undefined : 'none'}>
                <Divider orientation="vertical" h={24} my={'auto'} />

                <Button type="submit" loading={submitted}>
                  {!props?.defaultValues?.updatedAt ? 'Save Draft' : 'Update'}
                </Button>
              </Group>

              <Button
                type="submit"
                loading={submitted}
                color="blue"
                display={
                  !props?.defaultValues?.updatedAt || props.defaultValues.status != Status.ACTIVE
                    ? undefined
                    : 'none'
                }
                onClick={() => {
                  form.setValues({ ...form.values, status: Status.ACTIVE });

                  handleSubmit({
                    values: { ...form.values, status: Status.ACTIVE },
                  });
                }}
              >
                Adtivate
              </Button>
            </Group>
          </GridCol>
        </Grid>
      </Card>
    </form>
  );
}
