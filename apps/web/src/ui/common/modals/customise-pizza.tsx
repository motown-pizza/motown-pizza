'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

export default function CustomisePizza({
  opened,
  onClose,
  productTitle,
  price,
}: {
  opened: boolean;
  onClose: () => void;
  productTitle?: string;
  price?: number;
}) {
  const [quantity, setQuantity] = useState(1);

  const toppings = [
    'Mushrooms',
    'Olives',
    'Red onion',
    'Green pepper',
    'Pineapple',
    'Jalapenos',
  ];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="lg"
      radius="md"
      title={
        <Title order={2} c="white">
          Make it yours
        </Title>
      }
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 0,
        },
      }}
    >
      <Stack gap="lg" style={{ flex: 1, paddingBottom: 80 }}>
        {productTitle && (
          <Text c="dimmed" fz="sm">
            Customise {productTitle}
          </Text>
        )}

        {/* Extras section */}
        <div>
          <Title order={4} c="white" mb="xs">
            Extras
          </Title>
          <Stack gap="xs">
            <Checkbox
              label="Extra cheese (+ Kshs. 150)"
              color="yellow"
              defaultChecked={false}
            />
            <Checkbox
              label="Stuffed crust (+ Kshs. 200)"
              color="yellow"
              defaultChecked={false}
            />
          </Stack>
        </div>

        <Divider />

        {/* Extra toppings section */}
        <div>
          <Title order={4} c="white" mb="xs">
            Extra toppings
          </Title>
          <Group gap="xs">
            {toppings.map((topping, index) => (
              <Badge
                key={topping}
                variant={index === 0 ? 'filled' : 'outline'}
                color={index === 0 ? 'yellow' : 'gray'}
                size="lg"
                style={{ cursor: 'pointer' }}
              >
                {topping}
              </Badge>
            ))}
          </Group>
        </div>

        <Divider />

        {/* Add a dip section */}
        <div>
          <Title order={4} c="white" mb="xs">
            Add a dip
          </Title>
          <Card bg="var(--mantine-color-dark-8)" withBorder p="sm">
            <Group justify="space-between">
              <div>
                <Text fw={500} c="white" fz="sm">
                  BBQ sauce, 40 g cup
                </Text>
                <Text c="dimmed" fz="xs">
                  + Kshs. 100
                </Text>
              </div>
              <Button size="xs" variant="light" color="pri">
                Add
              </Button>
            </Group>
          </Card>
        </div>
      </Stack>

      {/* Sticky bottom footer */}
      <Box
        p="md"
        bg="var(--mantine-color-dark-8)"
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid var(--mantine-color-dark-6)',
          zIndex: 10,
          marginTop: 'auto',
        }}
      >
        <Group justify="space-between" wrap="nowrap" gap="md">
          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <IconMinus size={16} />
            </ActionIcon>
            <Text fw={600} fz="md" w={24} ta="center" c="white">
              {quantity}
            </Text>
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>

          <Button
            color="pri"
            fullWidth
            size="lg"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Add to cart | Kshs. {price}
          </Button>
        </Group>
      </Box>
    </Drawer>
  );
}
