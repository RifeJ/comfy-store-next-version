import { create } from "zustand";
import { persist } from "zustand/middleware";

export const storeCart = create(
  persist(
    (set) => ({
      cartItems: [],
      numItemsInCart: 0,

      addToCart: (product) =>
        set((state) => {
          const existItem = state.cartItems.find(
            (item) => item.cartID === product.cartID,
          );

          if (existItem) {
            const newCart = state.cartItems.map((item) => {
              if (
                item.productID === product.productID &&
                item.color === product.color
              ) {
                return { ...item, amount: item.amount + product.amount };
              }
              return item;
            });

            return {
              cartItems: newCart,
              numItemsInCart: newCart.reduce((acc, cur) => acc + cur.amount, 0),
            };
          }

          const newCart = [...state.cartItems, { ...product }];

          return {
            cartItems: newCart,
            numItemsInCart: newCart.reduce((acc, cur) => acc + cur.amount, 0),
          };
        }),

      removeFromCart: (cartID) =>
        set((state) => {
          const newCart = state.cartItems.filter(
            (item) => item.cartID !== cartID,
          );
          return {
            cartItems: newCart,
            numItemsInCart: newCart.reduce((acc, cur) => acc + cur.amount, 0),
          };
        }),

      removeCart: () =>
        set({
          cartItems: [],
          numItemsInCart: 0,
        }),

      editAmount: (cartID, amount) => {
        set((state) => {
          const newCart = state.cartItems.map((item) => {
            if (item.cartID === cartID) {
              return { ...item, amount: amount };
            }
            return item;
          });

          return {
            cartItems: newCart,
            numItemsInCart: newCart.reduce((acc, cur) => acc + cur.amount, 0),
          };
        });
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

export const storeFavorite = create(
  persist(
    (set) => ({
      favoriteItems: [],
      numItemsInFavorites: 0,

      toggleFav: (product) =>
        set((state) => {
          const productId = product.id || product._id;

          // console.log("=== ТЕСТ TOGGLE ===");
          // console.log(
          //   "Ищем продукт с ID:",
          //   productId,
          //   "Тип:",
          //   typeof productId,
          // );
          // console.log("Текущий массив избранного:", state.favoriteItems);

          const isEX = state.favoriteItems.some((item) => {
            const itemId = item.id || item._id;
            const match = String(itemId) === String(productId);
            // console.log(
            //   `Сравниваем элемент в базе (${itemId}) с кликнутым (${productId}) -> Результат:`,
            //   match,
            // );
            return match;
          });

          let updatedFavorites;

          if (isEX) {
            console.log("Товар НАЙДЕН! Удаляем его...");
            updatedFavorites = state.favoriteItems.filter((item) => {
              const itemId = item.id || item._id;
              return String(itemId) !== String(productId);
            });
          } else {
            // console.log("Товара НЕТ! Добавляем его...");
            updatedFavorites = [...state.favoriteItems, product];
          }

          return {
            favoriteItems: updatedFavorites,
            numItemsInFavorites: updatedFavorites.length,
          };
        }),

      removeFromFav: (id) =>
        set((state) => {
          const updatedFavorites = state.favoriteItems.filter(
            (item) => item.id !== id,
          );
          return {
            favoriteItems: updatedFavorites,
            numItemsInFavorites: updatedFavorites.length,
          };
        }),

      clearFavorites: () => set({ favoriteItems: [], numItemsInFavorites: 0 }),
    }),
    {
      name: "fav-storage",
    },
  ),
);
