import { createContext, useState } from "react";
import { CartItem, Product } from "./type";
import { useToast } from "@chakra-ui/react"

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
  const toast = useToast();
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
    toast({
      title: "Item agregado al carrito.",
      description: `Agregaste un ${product.title} al carrito.`,
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    })
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
