import "../styles/globals.css";
import { CartContext, CartProvider, Context } from "../product/context";
import {
  ChakraProvider,
  Container,
} from "@chakra-ui/react";
import { useContext } from "react";
import Header from "./components/Header";

function MyApp({ Component, pageProps }) {
  const { cart } = useContext<Context>(CartContext);

  return (
    <ChakraProvider>
      <CartProvider>
        <Header />
        <Container
          maxWidth="container.xl"
          centerContent
          padding={4}
        >
          <Component {...pageProps} />
        </Container>
      </CartProvider>
    </ChakraProvider>
  );
}

export default MyApp;
