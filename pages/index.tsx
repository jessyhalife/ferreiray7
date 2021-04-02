import { Button } from "@chakra-ui/button";

import { Image } from "@chakra-ui/image";
import { Grid, Stack, Text, Box, Heading } from "@chakra-ui/layout";
import Papa from "papaparse";

import { useEffect, useState, useContext } from "react";

import { Input } from "@chakra-ui/input";
import { Product } from "../product/type";
import { CartContext, Context } from "../product/context";
import axios from "axios";

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const {
    actions: { addToCart },
  } = useContext<Context>(CartContext);

  // const [filtered, setFiltered] = useState<Product[]>(products);
 // const [term, setTerm] = useState<string>("");

  if (!products)
    return (
      <Box>
        <Text>No encontramos ningún producto.</Text>
      </Box>
    );
  return (
    <Box width="100%">
      {/* <Stack
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
      </Stack> */}
      <Heading marginY={9} color="gray.700">Especialidades</Heading>
      <Grid gridGap={8} templateColumns="repeat(auto-fill, minmax(240px,1fr))">
        {products?.map((product) => (
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
            <Text fontSize="md">{product.description}</Text>

            <Text fontSize="2xl" fontWeight="500">
              ${product.price}
            </Text>

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
  const products = await axios
    .get(
      `https://docs.google.com/spreadsheets/d/e/2PACX-1vTXGFFgZ7YL0YlbdNroaEphDlm_ihBNcXnSPfQJyEveMHaHGgplOftCRlTkbDByWt4lb2_r4RYxqE0J/pub?output=csv`,
      {
        responseType: "blob",
      }
    )

    .then((response) => {
      return Papa.parse(response.data, {
        header: true,
        complete: (results) => {
          const products = results.data as Product[];
          return products.map((item) => {
            return { ...item, id: Number(item.id), price: Number(item.price) };
          });
        },
        error: (error) => {
          throw Error(error.message);
        },
      });
    });

  console.log(products);
  return {
    revalidate: 5,
    props: {
      products: products.data,
    },
  };
}

export default Home;
