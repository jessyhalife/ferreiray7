import { createContext, useState } from "react";
import { CartItem, Product } from "./type";

export interface Context {
  cart: CartItem[];
  actions: {
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    emptyCart: () => void;
  };
}

const CartContext = createContext({} as Context);

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(product: Product) {
    if (!cart.find((x) => x.product.id === product.id)) {
      setCart((_cart) => _cart.concat({ product, qty: 1 }));
    } else {
      const newCart = cart.map((item) =>
        item.product.id === product.id
          ? { product: item.product, qty: item.qty + 1 }
          : item
      );
      setCart(newCart);
    }
  }

  function removeFromCart(product: Product) {
    const newCart = cart.map((item) =>
      item.product.id === product.id
        ? { product: item.product, qty: item.qty - 1 }
        : item
    );

    setCart(newCart.filter((x) => x.qty > 0));
  }

  function emptyCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, actions: { addToCart, removeFromCart, emptyCart } }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
