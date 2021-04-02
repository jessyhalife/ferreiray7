import { Button, IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/layout";
import React, { useContext, useMemo, useRef } from "react";
import { CartContext, Context } from "../../product/context";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";

import { DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";

const Header: React.FC = () => {
  const {
    cart,
    actions: { removeFromCart, emptyCart },
  } = useContext<Context>(CartContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cartRef = useRef();

  const message = useMemo(
    () =>
      `Hola! quería hacerte el siguiente pedido:\n ${cart
        .map((x) => `* ${x.product.title} x ${x.qty}`)
        .join("\n")}`,
    [cart]
  );

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={999}
      borderWidth={1}
      borderColor="gray.200"
      boxShadow="sm"
      backgroundColor="white"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX={8}
        paddingY={4}
        maxWidth="container.xl"
        margin="auto"
      >
        <Stack direction="row" alignItems="center">
          <Image src="shop.png"></Image>
          <Text fontWeight="bold" fontSize="lg">
            Tienda de Jeni
          </Text>
        </Stack>
        <Button
          variant="solid"
          colorScheme="green"
          onClick={onOpen}
          borderWidth={1}
          borderColor="green.600"
          boxShadow="sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h1.929l.743-2h-4.195z" />
          </svg>
          <Text marginLeft={2} fontWeight="800" color="white">
            {cart?.reduce((cant, item) => cant + item.qty, 0)}
          </Text>
        </Button>
      </Stack>
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
                          onClick={() => removeFromCart(item.product)}
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
                <Button variant="link" onClick={emptyCart}>
                  Vaciar carrito
                </Button>
              </Stack>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default Header;
