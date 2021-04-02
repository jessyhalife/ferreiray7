import "../styles/globals.css";
import { ChakraProvider, Container, Heading, VStack, Image, Divider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Container marginY={8} maxWidth="container.xl" backgroundColor="gray.100" centerContent padding={8}>
        <VStack justifyContent="space-between">
          <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjhhpl4A3FZhw33Eyn6uLAKE1odIzxjzXnYg&usqp=CAU" width="128"></Image>
          <Heading>Tienda de Jeni</Heading>
        </VStack>
        <Divider marginY={8}></Divider>
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;
