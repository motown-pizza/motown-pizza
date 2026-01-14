'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useEffect, useRef } from 'react';
import {
  COOKIE_NAME,
  LOCAL_STORAGE_NAME,
  PARAM_NAME,
  STORE_NAME,
} from '@repo/constants/names';
import { useStorePost } from '@repo/libraries/zustand/stores/post';
import { loadInitialData } from '@/utilities/store';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@repo/utilities/storage';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { generateUUID } from '@repo/utilities/generators';
import { createClient } from '@/libraries/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCookieClient,
  setCookieClient,
} from '@repo/utilities/cookie-client';
import { Role } from '@repo/types/models/enums';
import { WEEK } from '@repo/constants/sizes';
import { ProfileGet } from '@repo/types/models/profile';
import {
  profileGet,
  profilesGet,
} from '@repo/handlers/requests/database/profiles';
import { RoleValue, useStoreRole } from '@repo/libraries/zustand/stores/role';
import {
  AppShellValue,
  useStoreAppShell,
} from '@repo/libraries/zustand/stores/shell';
import { samplePosts } from '@/data/sample/posts';
import { postsGet } from '@repo/handlers/requests/database/posts';
import {
  ThemeValue,
  useStoreTheme,
} from '@repo/libraries/zustand/stores/theme';
import { ColorScheme } from '@repo/types/enums';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { useStoreProfile } from '@repo/libraries/zustand/stores/profile';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { categoriesGet } from '@repo/handlers/requests/database/category';
import { useStoreProduct } from '@repo/libraries/zustand/stores/product';
import { productsGet } from '@repo/handlers/requests/database/products';
import { productVariantsGet } from '@repo/handlers/requests/database/product-variants';
import { ingredientsGet } from '@repo/handlers/requests/database/ingredients';
import { recipieItemsGet } from '@repo/handlers/requests/database/recipie-items';
import { ordersGet } from '@repo/handlers/requests/database/orders';
import { orderItemsGet } from '@repo/handlers/requests/database/order-items';
import { stockMovementsGet } from '@repo/handlers/requests/database/stock-movements';
import { transportersGet } from '@repo/handlers/requests/database/transporters';
import { useStoreProductVariant } from '@repo/libraries/zustand/stores/product-variant';
import { useStoreIngredient } from '@repo/libraries/zustand/stores/ingredient';
import { useStoreRecipieItem } from '@repo/libraries/zustand/stores/recipie-item';
import { useStoreOrder } from '@repo/libraries/zustand/stores/order';
import { useStoreOrderItem } from '@repo/libraries/zustand/stores/order-item';
import { useStoreStockMovement } from '@repo/libraries/zustand/stores/stock-movement';
import { useStoreTransporter } from '@repo/libraries/zustand/stores/transporter';
import { User } from '@supabase/supabase-js';

export const useSessionStore = (params?: {
  options?: { clientOnly?: boolean };
}) => {
  const { options } = params || {};
  const { clientOnly } = options || {};

  const { setSession } = useStoreSession();
  const supabase = createClient();

  useEffect(() => {
    const getUserSession = async () => {
      const { data: userSession } = await supabase.auth.getUser();

      const localId = getFromLocalStorage(LOCAL_STORAGE_NAME.TEMPID);

      // const { user: session } = userSession;
      const { user: session }: { user: Partial<User> } = {
        user: {
          id: localId,
          email: 'jane.smith@acme.inc',
          role: Role.ADMIN,
          user_metadata: {
            name: 'Jane Smith',
            avatar:
              'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
            phone: '0712345678',
          },
        },
      };

      if (!session) {
        if (!clientOnly) {
          setSession(null);
        }

        if (!localId) {
          // const tempId = generateUUID();
          const tempId = '02f5bae4-a33b-4264-a0e2-6418ca6ce44e';
          saveToLocalStorage(LOCAL_STORAGE_NAME.TEMPID, tempId);

          if (clientOnly) {
            setSession({ id: tempId } as any);
          }
        } else {
          if (clientOnly) {
            setSession({ id: localId } as any);
          }
        }
      } else {
        setSession(session as any);

        if (!localId || localId !== session.id) {
          saveToLocalStorage(LOCAL_STORAGE_NAME.TEMPID, session.id);
        }
      }
    };

    getUserSession();
  }, [setSession, supabase.auth, clientOnly]);
};

export const useUserRoleStore = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { session } = useStoreSession();
  const { setRole } = useStoreRole();

  useEffect(() => {
    if (!session) return;

    const initializeUserRole = async () => {
      // check for user role in cookies
      let userRole = await getCookieClient<RoleValue>(COOKIE_NAME.USER_ROLE);

      if (userRole) {
        // update expiry in cookies
        setCookieClient(COOKIE_NAME.USER_ROLE, userRole, {
          expiryInSeconds: WEEK,
        });
      } else {
        try {
          // fetch user profile
          const getUserProfile = async () => {
            const { item }: { item: ProfileGet } = await profileGet({
              profileId: session?.id as string,
            });

            return item;
          };

          const userProfile = await getUserProfile();

          if (!userProfile) return;

          if (!userProfile.role) {
            const onboardPath = '/onboarding/role';
            if (pathname.includes(onboardPath)) return;

            // redirect to role onboard page
            const redirectPath = `${onboardPath}?${PARAM_NAME.REDIRECT}=${pathname}`;
            router.replace(redirectPath);
          } else {
            // save in cookies
            setCookieClient(COOKIE_NAME.USER_ROLE, userProfile.role, {
              expiryInSeconds: WEEK,
            });

            userRole = userProfile.role as Role;
          }
        } catch (error) {
          console.error(
            '---> handler error - (get & set profile role):',
            error
          );
        }
      }

      // initialize state
      setRole(userRole);
    };

    initializeUserRole();
  }, [setRole, pathname, router, session]);
};

export const useAppshellStore = () => {
  const { setAppShell } = useStoreAppShell();

  useEffect(() => {
    const initializeAppShell = () => {
      let defaultValue: AppShellValue = {
        navbar: true,
        aside: false,
        child: { navbar: false, aside: false },
      };

      const appShellCookie = getCookieClient<AppShellValue>(
        COOKIE_NAME.APP_SHELL
      );

      if (!appShellCookie) {
        setCookieClient(COOKIE_NAME.APP_SHELL, defaultValue, {
          expiryInSeconds: WEEK,
        });
      } else {
        defaultValue = appShellCookie;
      }

      setAppShell(defaultValue);
    };

    initializeAppShell();
  }, [setAppShell]);
};

export const useThemeStore = () => {
  const { setTheme } = useStoreTheme();

  useEffect(() => {
    const initializeTheme = () => {
      let defaultValue: ColorScheme = DEFAULT_COLOR_SCHEME;

      const themeCookie = getCookieClient<ThemeValue>(
        COOKIE_NAME.COLOR_SCHEME_STATE
      );

      if (!themeCookie) {
        setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, defaultValue, {
          expiryInSeconds: WEEK,
        });
      } else {
        defaultValue = themeCookie;
      }

      setTheme(defaultValue);
    };

    initializeTheme();
  }, [setTheme]);
};

export const useStoreData = (params?: {
  options?: { clientOnly?: boolean };
}) => {
  const { options } = params || {};
  const { clientOnly } = options || {};

  const prevItemsRef = useRef<any[]>([]);

  const { session } = useStoreSession();
  const { setProfiles } = useStoreProfile();
  const { setPosts } = useStorePost();
  const { setCategories } = useStoreCategory();
  const { setProducts } = useStoreProduct();
  const { setProductVariants } = useStoreProductVariant();
  const { setIngredients } = useStoreIngredient();
  const { setRecipieItems } = useStoreRecipieItem();
  const { setOrders } = useStoreOrder();
  const { setOrderItems } = useStoreOrderItem();
  const { setStockMovements } = useStoreStockMovement();
  const { setTransporters } = useStoreTransporter();

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadProfiles = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.PROFILES,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await profilesGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setProfiles(stateUpdateItems),
      });
    };

    loadProfiles();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadPosts = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.POSTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: samplePosts, // TODO: remove this after testing
            };
          } else {
            return await postsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) => setPosts(stateUpdateItems),
      });
    };

    loadPosts();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadCategories = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.CATEGORIES,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await categoriesGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setCategories(stateUpdateItems),
      });
    };

    loadCategories();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadProducts = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.PRODUCTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await productsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setProducts(stateUpdateItems),
      });
    };

    loadProducts();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadProductVariants = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.PRODUCT_VARIANTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await productVariantsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setProductVariants(stateUpdateItems),
      });
    };

    loadProductVariants();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadIngredients = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.INGREDIENTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await ingredientsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setIngredients(stateUpdateItems),
      });
    };

    loadIngredients();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadRecipieItems = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.RECIPIE_ITEMS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await recipieItemsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setRecipieItems(stateUpdateItems),
      });
    };

    loadRecipieItems();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadOrders = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.ORDERS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await ordersGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) => setOrders(stateUpdateItems),
      });
    };

    loadOrders();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadOrderItems = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.ORDER_ITEMS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await orderItemsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setOrderItems(stateUpdateItems),
      });
    };

    loadOrderItems();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadStockMovements = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.STOCK_MOVEMENTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await stockMovementsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setStockMovements(stateUpdateItems),
      });
    };

    loadStockMovements();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (prevItemsRef.current.length) return;

    const loadTransporters = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.TRANSPORTERS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: [],
            };
          } else {
            return await transportersGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setTransporters(stateUpdateItems),
      });
    };

    loadTransporters();
  }, [session]);
};
