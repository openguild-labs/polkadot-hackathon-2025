import { Box, Flex, Button, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <Box
      bg="rgba(0, 128, 128, 0.8)" // Màu nền trong suốt
      backdropFilter="blur(10px)" // Hiệu ứng làm mờ nền phía sau
      boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)" // Hiệu ứng in chìm
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Flex
        p={4}
        align="center"
        maxWidth="1200px"
        margin="0 auto"
        color="white"
        justify="space-between"
      >
       <ChakraLink
        as={Link}
        to="/"
        fontSize="2xl"
        fontWeight="bold"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.5)"
        _hover={{
          textDecoration: "none",
          color: "yellow.300",
          transform: "scale(1.05)",
        }}
        transition="all 0.3s ease-in-out"
      >
        Seminar Voting
      </ChakraLink>
        <Flex gap={4}>
          <ChakraLink
            as={Link}
            to="/about"
            fontSize="md"
            fontWeight="medium"
            _hover={{
              textDecoration: "none",
              color: "teal.200",
            }}
          >
            "We're just interns"
          </ChakraLink>
         
        </Flex>

        <Button
          as={Link}
          to="/login"
          bg="white"
          color="teal.500"
          fontWeight="bold"
          size="sm"
          borderRadius="full"
          _hover={{
            bg: "teal.600",
            color: "white",
          }}
        >
          Back to Login
        </Button>
      </Flex>
    </Box>
  );
}

export default Navbar;