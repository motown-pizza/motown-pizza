import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import {
  Anchor,
  BackgroundImage,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Overlay,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconMoped, IconPizza } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ImageDefault from '@repo/components/common/images/default';
import ModalFeedback from '@/components/common/modal/feedback';
import NextLink from '@repo/components/common/anchor/next-link';

export const metadata: Metadata = { title: 'About' };

export default function About() {
  return (
    <LayoutPage>
      <LayoutSection id="page-about-intro" margined>
        <Grid align="center" gutter={'xl'}>
          <GridCol span={{ base: 12, md: 6 }}>
            <ImageDefault
              src="https://plus.unsplash.com/premium_photo-1661517310448-9d3316820532?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              height={{ base: 640 }}
              alt="about image"
              radius={'xl'}
            />
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <GridCol span={{ base: 12, md: 6 }}></GridCol>
            <Stack>
              <Title order={1}>About Us</Title>

              <Text>
                Welcome to MOTOWN Pizza – Where Pizza Meets Passion! At MOTOWN,
                we’re not just serving Pizza; we’re crafting culinary
                experiences that ignite your taste buds and warm your heart.
                We’re thrilled to invite you to join us on a delicious journey
                that’s been a couple of years in the making.
              </Text>

              <Text>
                <Text component="span" inherit fw={'bold'} c={'sec'}>
                  Our Pizza
                </Text>
                : Handcrafted Perfection…Every Pizza at MOTOWN is an authentic
                experience. Our talented and experienced chefs use only the
                freshest, locally- sourced ingredients to create mouthwatering
                masterpieces that bursts with flavor. From our signature Motown
                Meltdown crust to our homemade sauces and premium toppings,
                we’re dedicated to deliver pizza perfection with every slice.
              </Text>

              <Text>
                <Text component="span" inherit fw={'bold'} c={'sec'}>
                  Our Commitment
                </Text>
                : Quality and Community – We’re more than just a Pizzeria; we’re
                a gathering for friends, families and Pizza enthusiasts alike.
                Our commitment extends beyond serving exceptional pizzas; it’s
                about nurturing a sense of community. When you order from us,
                you’re not just our customers; you’re our extended family.
              </Text>

              <Text>
                <Text component="span" inherit fw={'bold'} c={'sec'}>
                  Sustainability Matters
                </Text>
                : At MOTOWN, we take our responsibility to the environment
                seriously. We make eco-friendly choices wherever possible, from
                our sustainable sourcing practices to our eco-conscious
                packaging. Together, we can enjoy great pizza while preserving
                our planet for future generations
              </Text>
            </Stack>
          </GridCol>

          <GridCol span={12}>
            <Text ta={'center'}>
              <Text component="span" inherit fw={'bold'} c={'sec'}>
                Your feedback Matters
              </Text>
              : We believe in continuous improvement, and your feedback is
              invaluable. Whether it’s a suggestion or a compliment, we’re
              always here to listen. Your input helps us grow and serve you
              better. You can share your feedback{' '}
              <ModalFeedback>
                <Anchor inherit>here</Anchor>
              </ModalFeedback>
              .
            </Text>
          </GridCol>
        </Grid>
      </LayoutSection>

      <LayoutSection id="page-about-cta" margined containerized={'md'}>
        <Card
          bg={'var(--mantine-color-pri-6)'}
          c={'white'}
          p={{ base: 'md', sm: 'xl' }}
          my={'xl'}
        >
          <Stack align="center" gap={'xl'}>
            <Title order={2} ta={'center'}>
              Join Us Today
            </Title>

            <Text fz={'sm'} ta={'center'} maw={{ md: '80%' }}>
              So, What are you waiting for? Gather your friends and family, or
              come as you are, and let us treat you to a memorable pizza
              experience. Join us in Westlands, Kileleshwa, Riverside and
              discover why MOTOWN Pizza is more than just a Pizzeria; It’s a
              place where flavors, fun and friendships come together.
            </Text>

            <Group justify="center">
              <NextLink href="/order/select-store?orderType=delivery">
                <Button
                  color="ter.6"
                  size="md"
                  leftSection={
                    <IconMoped
                      size={ICON_SIZE + 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                >
                  Order Online
                </Button>
              </NextLink>

              <NextLink href="/order/select-store?orderType=collection">
                <Button
                  color="blue"
                  size="md"
                  leftSection={
                    <IconPizza
                      size={ICON_SIZE + 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                >
                  View Our Stores
                </Button>
              </NextLink>
            </Group>

            <Divider w={'100%'} color="sec" />

            <div>
              <Text fz={'xs'}>
                Follow us on social media and stay tuned for exciting offers,
                events and more!
              </Text>

              <Text fz={'xs'}>
                Thank you for choosing MOTOWN Pizza KENYA. We can’t wait to
                serve you.
              </Text>
            </div>
          </Stack>
        </Card>
      </LayoutSection>

      <LayoutSection id="page-about-content-1" margined containerized={'sm'}>
        <Stack gap={'xl'}>
          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              Our Purpose
            </Title>

            <Text>
              Our existence is driven by one purpose: To serve high-quality
              pizza that is delicious,madewith fresh ingredients every day,
              prepared with care and traceability fromresponsible sources.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              Our People
            </Title>

            <Text>
              Our people make it happen by ensuring that they do the right
              thing, the right way. We ensure that our staff are treated well,
              get fair wages, and ensure they share our commitment to quality
              and service.
            </Text>
          </Stack>
        </Stack>
      </LayoutSection>

      <LayoutSection
        id="page-about-content-brand"
        margined
        containerized={'md'}
      >
        <Title order={2} fz={'xl'} c={'blue'} ta={'center'}>
          Our Brand
        </Title>

        <Grid mt={'xl'}>
          {brandItems.map((item) => (
            <GridCol span={{ base: 12, sm: 6 }} key={item.title}>
              <BackgroundImage
                src={item.image}
                radius="sm"
                h={'100%'}
                p={{ base: 'xl' }}
                pos={'relative'}
                c={'white'}
                mih={240}
              >
                <Overlay backgroundOpacity={0.55} style={{ zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Stack gap={'xl'}>
                    <Title order={4} fz={'lg'}>
                      {item.title}
                    </Title>

                    <Text fz={'sm'}>{item.desc}</Text>
                  </Stack>
                </div>
              </BackgroundImage>
            </GridCol>
          ))}
        </Grid>
      </LayoutSection>

      <LayoutSection id="page-about-content-2" margined containerized={'sm'}>
        <Stack gap={'xl'}>
          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              Our Beliefs
            </Title>

            <Text>
              <Text component="span" inherit fw={'bold'} c={'sec'}>
                Quality
              </Text>
              : We believe in using fresh ingredients every day and provide top-
              notch service. Quality is non-negotiable.
            </Text>

            <Text>
              <Text component="span" inherit fw={'bold'} c={'sec'}>
                Customer Satisfaction
              </Text>
              : We believe in customer satisfaction. We listen to feedback,
              address concerns promptly, and constantly strive to improve.
            </Text>

            <Text>
              <Text component="span" inherit fw={'bold'} c={'sec'}>
                Sustainability
              </Text>
              : As part of our sustainability, we source local and organic
              ingredients.
            </Text>
          </Stack>

          <Stack>
            <Title order={2} fz={'xl'} c={'blue'}>
              Our Customers
            </Title>

            <Text>
              Our customers are the lifeblood of our business as they provide
              the revenue, feedback and loyalty necessary for the business to
              thrive and grow. We prioritize customer satisfaction and
              continually striving to meet their needs which builds a strong and
              enduring presence in the market.
            </Text>
          </Stack>
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}

const brandItems = [
  {
    image:
      'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Quality and Taste',
    desc: 'Our brand stands for high-quality ingredients and delicious pizza which is tasty and satisfying.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Authentic Taste',
    desc: 'As our tagline would say ‘Authentic taste that rules’. Our preparation, ingredients and flavor give our customers an authentic experience.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Freshness',
    desc: 'Our Pizzas are made with the freshest, locally sourced ingredients from a town in the mountain region of Kenya hence the name MOTOWN.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1632595513762-c5c00d169f70?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Customization',
    desc: 'Our pizzas are customizable as we give our customers an opportunity to create their perfect pizza with a range of toppings and crust options.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=536&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Innovation',
    desc: 'Our ordering and delivering processes of our pizzas is driven by technology and innovation.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1620374645466-dc3ff1558148?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Delivery Timelines',
    desc: 'Our pizzas are delivered Hot & Fresh to our customers in record time of 26 minutes. The delivery is within a radius of 3-5 Kilometers within any MOTOWN Pizza store.',
  },
];
