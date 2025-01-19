import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import getVotingContract from "../../utils/votingContract";

const GetResult = () => {
  const [roundId, setRoundId] = useState(""); // Round ID input
  const [resultSeminar, setResultSeminar] = useState(null); // Seminar result
  const [resultSpeaker, setResultSpeaker] = useState(null); // Speaker result
  const [isLoadingSeminar, setIsLoadingSeminar] = useState(false); // Loading state for seminar
  const [isLoadingSpeaker, setIsLoadingSpeaker] = useState(false); // Loading state for speaker

  //seminar result
  const fetchResultSeminar = async () => {
    setIsLoadingSeminar(true);
    try {
      const votingContract = await getVotingContract();
      const [seminarIds, votes] = await votingContract.getResultSeminar(roundId);

      // BigInt=> string
      const result = {
        seminarIds: seminarIds.map((id) => id.toString()),
        votes: votes.map((vote) => vote.toString()),
      };

      setResultSeminar(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching result for seminar:", error);
      alert("Error fetching result for seminar.");
    } finally {
      setIsLoadingSeminar(false);
    }
  };

  // speaker result
  const fetchResultSpeaker = async () => {
    setIsLoadingSpeaker(true);
    try {
      const votingContract = await getVotingContract();
      const [speakers, votes] = await votingContract.getResultSpeaker(roundId);

      // BigInt=> string
      const result = {
        speakers,
        votes: votes.map((vote) => vote.toString()),
      };

      setResultSpeaker(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching result for speaker:", error);
      alert("Không lấy được vòng bầu chọn có thể do bạn chưa nhập roundID?.");
    } finally {
      setIsLoadingSpeaker(false);
    }
  };

  return (
    <VStack spacing={6}>
      <Heading size="md" color="teal.500">
        Kết quả bỏ phiếu
      </Heading>

      {/* Input for Round ID */}
      <Box width="100%">
        <Input
          placeholder="Nhập Round ID"
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          size="md"
          borderColor="teal.500"
        />
      </Box>

      {/* Button to fetch Seminar Result */}
      <Button
        colorScheme="red"
        onClick={fetchResultSeminar}
        isLoading={isLoadingSeminar}
        loadingText="Đang tải..."
      >
        Lấy kết quả Seminar
      </Button>

      {/* Seminar Result Table */}
      {resultSeminar && (
        <Box mt={4} maxHeight="300px" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          <Text fontWeight="bold" mb={2}>
            Kết quả Seminar:
          </Text>
          <Table variant="simple" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>ID Seminar</Th>
                <Th>Số phiếu</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resultSeminar.seminarIds.map((id, index) => (
                <Tr key={index}>
                  <Td>{id}</Td>
                  <Td>{resultSeminar.votes[index]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Button to fetch Speaker Result */}
      <Button
        colorScheme="red"
        onClick={fetchResultSpeaker}
        isLoading={isLoadingSpeaker}
        loadingText="Đang tải..."
      >
        Lấy kết quả Speaker
      </Button>

      {/* Speaker Result Table */}
      {resultSpeaker && (
        <Box mt={4} maxHeight="300px" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          <Text fontWeight="bold" mb={2}>
            Kết quả Speaker:
          </Text>
          <Table variant="simple" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Tên Speaker</Th>
                <Th>Số phiếu</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resultSpeaker.speakers.map((name, index) => (
                <Tr key={index}>
                  <Td>{name}</Td>
                  <Td>{resultSpeaker.votes[index]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </VStack>
  );
};

export default GetResult;
