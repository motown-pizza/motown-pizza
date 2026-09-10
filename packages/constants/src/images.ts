const imageUrl = `/images`;
const iconUrl = `https://img.icons8.com`;

export const images = {
  brand: {
    logo: {
      landscape: {
        default: `${imageUrl}/brand/logo/landscape/default.png`,
        meta: `${imageUrl}/brand/logo/landscape/meta.png`,
      },
      potrait: {
        default: `${imageUrl}/brand/logo/potrait/default.png`,
        meta: `${imageUrl}/brand/logo/potrait/meta.png`,
      },
    },
    icon: {
      light: `${iconUrl}/fluency/48/nextjs.png`,
      dark: `${iconUrl}/fluency/48/nextjs.png`,
    },
  },

  mpesa: `${imageUrl}/mpesa.png`,

  home: {
    tuesday: `${imageUrl}/home/tuesday.jpg`,
    double: `${imageUrl}/home/double.jpg`,
    main: `https://plus.unsplash.com/premium_photo-1677607235809-7c5f0b240117?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
  },

  theme: {
    deals: `${imageUrl}/theme/deals-offers.webp`,
    footer: `${imageUrl}/theme/footer.webp`,
    footer2: `${imageUrl}/theme/footer2.webp`,
    vibes: `${imageUrl}/theme/fresh-pizza-good-vibes.webp`,
    vibes2: `${imageUrl}/theme/fresh-pizza-good-vibes2.webp`,
    menu: {
      addons: `${imageUrl}/theme/menu-addons.webp`,
      beefPizza: `${imageUrl}/theme/menu-beef-pizza.webp`,
      chickenPizza: `${imageUrl}/theme/menu-chicken-pizza.webp`,
      veggiePizza: `${imageUrl}/theme/menu-veggie-pizza.webp`,
      prices: `${imageUrl}/theme/menu-prices.webp`,
      sauces: `${imageUrl}/theme/menu-sauces.webp`,
      sunday: `${imageUrl}/theme/sunday-family-day-out.webp`,
      thursday: `${imageUrl}/theme/thursday-office-takeover.webp`,
      tuesday: `${imageUrl}/theme/tuesday-twosday.webp`,
    },
  },
};
