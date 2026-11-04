'use client';

import React, { useEffect, useState } from 'react';
import { FloatingIndicator, Group, UnstyledButton } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { OrderFulfilmentType } from '@repo/types';
import classes from './fulfillment.module.css';
import { IconBasket, IconMoped } from '@tabler/icons-react';
import { useStoreOrderPlacement } from '@repo/store';

export default function IndicatorFulfilment() {
  const { orderDetails, setOrderDetails } = useStoreOrderPlacement();

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useState(
    fulfillmentTypes.indexOf(
      fulfillmentTypes.find((ti) => ti.value == orderDetails?.fulfillmentType)!,
    ),
  );

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = fulfillmentTypes.map((item, index) => (
    <UnstyledButton
      key={item.value}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
    >
      <span className={classes.controlLabel}>
        <Group gap={'xs'} justify="center" wrap="nowrap">
          <item.icon size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
          {item.value}
        </Group>
      </span>
    </UnstyledButton>
  ));

  useEffect(() => {
    if (orderDetails === undefined) return;
    if (orderDetails === null) return;
    if (!orderDetails?.fulfillmentType) return;

    setOrderDetails({ ...orderDetails, fulfillmentType: fulfillmentTypes[active].value });
  }, [active]);

  return (
    <div className={classes.root} ref={setRootRef} style={{ width: '100%' }}>
      <Group grow ta={'center'} gap={'xs'}>
        {controls}
      </Group>

      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className={classes.indicator}
      />
    </div>
  );
}

const fulfillmentTypes = [
  { icon: IconMoped, value: OrderFulfilmentType.DELIVERY },
  { icon: IconBasket, value: OrderFulfilmentType.COLLECTION },
];
