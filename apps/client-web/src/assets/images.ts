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

  icons: {
    social: {
      facebook: `${iconUrl}/fluency/96/facebook.png`,
      instagram: `${iconUrl}/fluency/96/instagram-new.png`,
      twitterx: `${iconUrl}/color/96/twitterx--v1.png`,
      linkedin: `${iconUrl}/fluency/96/linkedin.png`,
      whatsapp: `${iconUrl}/color/96/whatsapp--v1.png`,
    },

    google: `${iconUrl}/fluency/96/google-logo.png`,
    credentials: `${iconUrl}/material-rounded/96/mail.png`,
    nextjs: `${iconUrl}/fluency/48/nextjs.png`,
    mpesa: `${iconUrl}/color/96/mpesa.png`,
  },
};
