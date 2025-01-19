import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaTrophy, FaCrown, FaMedal } from "react-icons/fa";

const ShowResults = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const savedData = JSON.parse(localStorage.getItem("chooseBestResults"));
    setResults(savedData);
  }, []);

  if (!results) {
    return (
      <Box
        bg="whiteAlpha.900"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        maxWidth="600px"
        mx="auto"
        mt={8}
        textAlign="center"
      >
        <Heading size="lg" color="teal.600" mb={4}>
          Kết Quả Bình Chọn
        </Heading>
        <Text>Chưa có kết quả nào được lưu.</Text>
      </Box>
    );
  }

  return (
    <Box
      bg="whiteAlpha.900"
      p={8}
      borderRadius="lg"
      boxShadow="xl"
      maxWidth="800px"
      mx="auto"
      mt={8}
    >
      <Heading size="lg" color="teal.600" mb={6} textAlign="center">
        Kết Quả Round {results.roundNumber}
      </Heading>
      <VStack spacing={6} align="stretch">
        {/* Top 1 */}
        <Box>
          <HStack mb={2}>
            <Icon as={FaCrown} color="gold" w={6} h={6} />
            <Text fontWeight="bold" fontSize="lg">
              Top 1
            </Text>
          </HStack>
          <VStack mt={3} spacing={3} align="stretch">
            {results.top1.names.map((name, index) => (
              <Text
                key={index}
                bg="yellow.100"
                p={3}
                borderRadius="md"
                boxShadow="sm"
              >
                {name}
              </Text>
            ))}
          </VStack>
        </Box>

        {/* Top 2 */}
        <Box>
          <HStack mb={2}>
            <Icon as={FaMedal} color="silver" w={6} h={6} />
            <Text fontWeight="bold" fontSize="lg">
              Top 2
            </Text>
          </HStack>
          <VStack mt={3} spacing={3} align="stretch">
            {results.top2.names.map((name, index) => (
              <Text
                key={index}
                bg="gray.200"
                p={3}
                borderRadius="md"
                boxShadow="sm"
              >
                {name}
              </Text>
            ))}
          </VStack>
        </Box>

        {/* Top 3 */}
        <Box>
          <HStack mb={2}>
            <Icon as={FaTrophy} color="bronze" w={6} h={6} />
            <Text fontWeight="bold" fontSize="lg">
              Top 3
            </Text>
          </HStack>
          <VStack mt={3} spacing={3} align="stretch">
            {results.top3.names.map((name, index) => (
              <Text
                key={index}
                bg="orange.100"
                p={3}
                borderRadius="md"
                boxShadow="sm"
              >
                {name}
              </Text>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ShowResults;