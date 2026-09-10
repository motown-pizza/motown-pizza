import { LayoutMain } from '@repo/ui';
import { AffixNavbar } from '@repo/ui';
import { LayoutSection } from '@repo/ui';
import { Center } from '@mantine/core';
import { AnchorNextLink } from '@repo/ui';

export default function Home() {
  return (
    <HomeLayout>
      <LayoutSection id="home">
        <Center mih={'100vh'}>
          <AnchorNextLink href={'/pos'}>pos</AnchorNextLink>
        </Center>
      </LayoutSection>
    </HomeLayout>
  );
}

async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutMain>
      <div>
        <main>{children}</main>

        <AffixNavbar />
      </div>
    </LayoutMain>
  );
}
