import { Button } from "@chakra-ui/button";

import { Image } from "@chakra-ui/image";
import { Grid, Stack, Text, Box, Heading } from "@chakra-ui/layout";
import Papa from "papaparse";

import { useContext } from "react";

import { Product } from "../product/type";
import { CartContext, Context } from "../product/context";
import axios from "axios";

interface Props {
  products: Product[];
  error: string;
}

const Home: React.FC<Props> = ({ products, error }) => {
  const {
    actions: { addToCart },
  } = useContext<Context>(CartContext);

  // const [filtered, setFiltered] = useState<Product[]>(products);
  // const [term, setTerm] = useState<string>("");
  if (!products || products.length === 0)
    return (
      <Box>
        <Text>No encontramos ningún producto.</Text>
      </Box>
    );
  return (
    <Box width="100%">
      <Heading marginY={9} color="gray.700">
        Especialidades
      </Heading>
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
      process.env.FILE_URL,
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
          return error.message;
        },
      });
    })
    .catch((error) => {
      return { data: [] };
    });

  return {
    revalidate: 5,
    props: {
      products: products.data,
    },
  };
}

export default Home;
