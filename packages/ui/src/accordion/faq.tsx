import React from 'react';
import { Accordion, AccordionControl, AccordionItem, AccordionPanel, Text } from '@mantine/core';

export function AccordionFaq({
  props,
}: {
  props: { items: { q: string; a: string | React.ReactNode }[] };
}) {
  const items = props.items.map((item) => (
    <AccordionItem key={item.q} value={item.q}>
      <AccordionControl>
        <Text component="span" inherit c={'sec'} fw={500}>
          {item.q}
        </Text>
      </AccordionControl>
      <AccordionPanel>{item.a}</AccordionPanel>
    </AccordionItem>
  ));

  return <Accordion defaultValue={props.items[0].q}>{items}</Accordion>;
}
