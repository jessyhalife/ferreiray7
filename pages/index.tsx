import { Button } from "@chakra-ui/button";

import { Image } from "@chakra-ui/image";
import { Grid, Stack, Text, Box } from "@chakra-ui/layout";

import { useEffect, useState, useContext } from "react";

import { Input } from "@chakra-ui/input";
import { Product } from "../product/type";
import { CartContext, Context } from "../product/context";

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const {
    actions: { addToCart },
  } = useContext<Context>(CartContext);

  const [filtered, setFiltered] = useState<Product[]>(products);
  const [term, setTerm] = useState<string>("");
  
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
    <Box width="100%">
      <Stack
        direction="row"
        padding={4}
        marginY={8}
        alignItems="center"
        backgroundColor="gray.100"
        borderRadius={4}
        boxShadow="sm"
        width="100%"
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
              colorScheme="pink"
              variant="outline"
              onClick={() => addToCart(product)}
            >
              Agregar al carrito
            </Button>
          </Stack>
        ))}
      </Grid>
    </Box>
  );
};

export async function getStaticProps() {
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
