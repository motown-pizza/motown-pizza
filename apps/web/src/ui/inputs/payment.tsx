import { useState } from 'react';
import { Group, Text, Stack, RadioCard, RadioIndicator, RadioGroup } from '@mantine/core';
import classes from './payment.module.css';
import { OrderPaymentMethod } from '@repo/types';

export default function InputPayment({ value, setValue }: { value: any; setValue: any }) {
  const data = [
    {
      value: OrderPaymentMethod.ONLINE,
      name: 'M-Pesa',
      description: `A prompt will be sent to the provided number.`,
    },
    {
      value: OrderPaymentMethod.CASH,
      name: 'Cash on Delivery',
      description: 'Pay the rider when the order arrives.',
    },
  ];

  const cards = data.map((item) => {
    const active = item.value == value;

    return (
      <RadioCard
        className={`${classes.root} ${active ? 'bg-[var(--mantine-color-ter-light)]/50!' : undefined}`}
        value={item.value}
        key={item.value}
      >
        <Group wrap="nowrap" align="flex-start">
          <RadioIndicator color="ter" />
          <div>
            <Text className={classes.label}>{item.name}</Text>
            <Text className={classes.description}>{item.description}</Text>
          </div>
        </Group>
      </RadioCard>
    );
  });

  return (
    <>
      <RadioGroup value={value} onChange={setValue} aria-label="Paymen method">
        <Stack gap="xs">{cards}</Stack>
      </RadioGroup>
    </>
  );
}
