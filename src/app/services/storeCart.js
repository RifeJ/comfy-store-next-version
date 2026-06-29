import { create } from "zustand";
import { persist } from "zustand/middleware";

const storeCart = create(
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

export default storeCart;
