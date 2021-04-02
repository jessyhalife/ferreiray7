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
import { useEffect, useRef, useState, useMemo, useContext } from "react";

import { DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Product, CartItem } from "../product/type";
import { CartContext, Context } from "../product/context";

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const {
    cart,
    actions: { addToCart },
  } = useContext<Context>(CartContext);

  const [filtered, setFiltered] = useState<Product[]>(products);
  const [term, setTerm] = useState<string>("");

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  // function handleAddToCart(product: Product) {
  //   if (!cart.find((x) => x.product.id === product.id)) {
  //     setCart((_cart) => _cart.concat({ product, qty: 1 }));
  //   } else {
  //     const newCart = cart.map((item) =>
  //       item.product.id === product.id
  //         ? { product: item.product, qty: item.qty + 1 }
  //         : item
  //     );
  //     setCart(newCart);
  //   }
  // }

  // function handleRemove(product: Product) {
  //   const newCart = cart.map((item) =>
  //     item.product.id === product.id
  //       ? { product: item.product, qty: item.qty - 1 }
  //       : item
  //   );

  //   setCart(newCart.filter((x) => x.qty > 0));
  // }

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
      <Stack
        direction="row"
        padding={4}
        marginY={8}
        alignItems="center"
        backgroundColor="gray.100"
        borderRadius={4}
        boxShadow="sm"
      >
        <Text>Buscar producto:</Text>
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ingrese su búsqueda"
          maxWidth="xl"
          backgroundColor="white"
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
              onClick={() => addToCart(product)}
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

export default Home;
