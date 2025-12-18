import { List, ListItem } from '@mantine/core';

export const faqLoyalty = [
  {
    q: 'What is the Mo Town Slice Points Loyalty Program?',
    a: 'It’s our free rewards program that lets you earn points every time you buy a pizza. When you collect enough points, you get a free pizza.',
  },
  {
    q: 'How do I join the loyalty program?',
    a: 'Simply give your name, phone number and Email when ordering in-store or online. You’ll be registered automatically and can start earning points right away.',
  },
  {
    q: 'How do I earn points?',
    a: (
      <>
        <p>You earn 1 point for every pizza you buy.</p>
        <p>Points are collected by pizza size:</p>

        <List my={'xs'}>
          <ListItem> Small</ListItem>
          <ListItem>Medium</ListItem>
          <ListItem>Large</ListItem>
          <ListItem>Long Play (Extra Large)</ListItem>
        </List>
      </>
    ),
  },
  {
    q: 'Can I combine points from different pizza sizes?',
    a: (
      <>
        <p>No. Points must be collected by the same size.</p>
        <p>For example, 12 Medium points = a free Medium pizza.</p>
      </>
    ),
  },
  {
    q: 'How many points do I need to get a free pizza?',
    a: 'You need 12 points of the same pizza size to get one free pizza of that size.',
  },
  {
    q: 'Does Motown Meltdown have a loyalty reward?',
    a: (
      <>
        <p>
          Yes. Our signature Motown Meltdown has its own points system because
          of the special cheese crust.
        </p>
        <p>It is available only in:</p>

        <List my={'xs'}>
          <ListItem>Medium</ListItem>
          <ListItem>Large</ListItem>
        </List>

        <p>
          You must collect 12 Meltdown points to earn a free Motown Meltdown
          pizza.
        </p>
      </>
    ),
  },
  {
    q: 'Do points expire?',
    a: 'Yes. Points expire if you don’t make a purchase for 6 months.',
  },
  {
    q: 'Are free pizzas really free?',
    a: (
      <>
        <p>Yes, the free pizza covers:</p>

        <List my={'xs'}>
          <ListItem>The pizza size earned</ListItem>
          <ListItem>Standard menu toppings</ListItem>
        </List>

        <p>
          Extra toppings, stuffed crust upgrades, and premium add-ons are paid
          separately.
        </p>
      </>
    ),
  },
  {
    q: 'Can I use my free pizza with other offers or discounts?',
    a: 'No. Free pizzas cannot be combined with other discounts, promos, or deals.',
  },

  {
    q: 'Can I transfer my points to someone else?',
    a: 'No. Points are linked to your phone number and cannot be transferred, sold, or shared.',
  },

  {
    q: 'What happens if I lose my phone number?',
    a: 'If you change your phone number, just let our staff know. We’ll help update your account.',
  },

  {
    q: 'Is it really free to join?',
    a: 'Yes — joining the Slice Points program is completely free.',
  },

  {
    q: 'Can Mo Town Pizza change the program?',
    a: 'Yes. To keep the program fair and sustainable, Mo Town Pizza may update the loyalty program from time to time.',
  },
];
