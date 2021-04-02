import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import {
  Grid,
  Stack,
  Text,
  Box,
  List,
  ListItem,
  Link,
} from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { useEffect, useRef, useState, useMemo } from "react";

import { DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";

interface Props {
  products: Product[];
}

interface CartItem {
  product: Product;
  qty: number;
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filtered, setFiltered] = useState<Product[]>(products);
  const [term, setTerm] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cartRef = useRef();

  const message = useMemo(
    () =>
      `Hola! quería hacerte el siguiente pedido:\n ${cart
        .map((x) => `* ${x.product.title} x ${x.qty}`)
        .join("\n")}`,
    [cart]
  );

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  function handleAddToCart(product: Product) {
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

  function handleRemove(product: Product) {
    const newCart = cart.map((item) =>
      item.product.id === product.id
        ? { product: item.product, qty: item.qty - 1 }
        : item
    );

    setCart(newCart.filter((x) => x.qty > 0));
  }

  useEffect(() => {
    if (term === "") setFiltered(products);
    else
      setFiltered((items) =>
        items.filter((x) => x.title.toLowerCase().includes(term.toLowerCase()))
      );
  }, [term]);

  if (!filtered)
    return (
      <Box>
        <Text>No encontramos ningún producto.</Text>
      </Box>
    );
  return (
    <Box>
      {cart.length > 0 && (
        <Stack
          direction="row"
          paddingY={8}
          justifyContent="flex-end"
          position="sticky"
          top={0}
          zIndex={99999}
        >
          <Button
            colorScheme="green"
            ref={cartRef}
            variant="solid"
            onClick={onOpen}
            width={["100%", "auto", "auto"]}
          >
            Ver carrito
            <Text marginLeft={2} fontWeight="500">
              ({cart.reduce((cant, item) => cant + item.qty, 0)})
            </Text>
          </Button>
        </Stack>
      )}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={cartRef}
      >
        <DrawerOverlay zIndex={999999}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Carrito</DrawerHeader>

            <DrawerBody marginTop={12}>
              {cart.length > 0 && (
                <List spacing={3}>
                  {cart.map((item) => (
                    <ListItem key={item.product.id}>
                      <Stack direction="row" justifyContent="space-between">
                        <Text fontSize="sm">
                          {item.product.title} x {item.qty}
                        </Text>
                        <Text fontSize="sm" fontWeight="500">
                          ${item.product.price * item.qty}
                        </Text>
                        <IconButton
                          onClick={() => handleRemove(item.product)}
                          aria-label="delete"
                          colorScheme="white"
                          color="gray.500"
                          variant="solid"
                          fontSize="md"
                          icon={<DeleteIcon />}
                        />
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              )}
              {cart.length === 0 && (
                <Text textAlign="center">No hay ítems</Text>
              )}
            </DrawerBody>
            <DrawerFooter marginBottom={16}>
              <Stack direction="column" width="100%">
                <Stack direction="row" justifyContent="space-between">
                  <Text fontSize="xl">Total</Text>
                  <Text fontSize="2xl" fontWeight="500">
                    $
                    {parseFloat(
                      cart
                        .reduce(
                          (total, item) =>
                            total + item.product.price * item.qty,
                          0
                        )
                        .toString(10)
                    ).toFixed(2)}
                  </Text>
                </Stack>
                <Button
                  isDisabled={cart.length === 0}
                  colorScheme="blue"
                  isExternal
                  as={Link}
                  variant="solid"
                  href={`https://wa.me/5491141414141?text=${encodeURIComponent(
                    message
                  )}`}
                >
                  Checkout
                </Button>
                <Button variant="link" onClick={() => setCart([])}>
                  Vaciar carrito
                </Button>
              </Stack>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <Stack
        direction="row"
        padding={4}
        marginY={8}
        alignItems="center"
        backgroundColor="gray.200"
        borderRadius={4}
        boxShadow="sm"
      >
        <Text>Buscar producto:</Text>
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ingrese su búsqueda"
          maxWidth="xl"
        ></Input>
      </Stack>
      <Grid gridGap={8} templateColumns="repeat(auto-fill, minmax(240px,1fr))">
        {filtered.map((product) => (
          <Stack
            boxShadow="sm"
            borderRadius="md"
            key={product.id}
            borderColor="gray.200"
            padding={4}
            borderWidth={1}
            justifyContent="space-between"
          >
            <Image
              src={product.image}
              objectFit="cover"
              height={240}
              borderTopRadius="md"
            ></Image>
            <Text fontSize="xl" fontWeight="500">
              {product.title}
            </Text>
            <Text fontSize="2xl" fontWeight="500">
              ${product.price}
            </Text>

            <small>{product.description}</small>

            <Button
              colorScheme="purple"
              variant="solid"
              onClick={() => handleAddToCart(product)}
            >
              Add to cart
            </Button>
          </Stack>
        ))}
      </Grid>
    </Box>
  );
};

export async function getStaticProps(context) {
  const products = await fetch(`https://fakestoreapi.com/products`)
    .then((result) => {
      return result.json();
    })
    .then((data: Product[]) => data);
  return {
    revalidate: 20,
    props: {
      products,
    },
  };
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default Home;
