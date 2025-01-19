import React, { useState } from "react";
import {
  VStack,
  Input,
  Button,
  Box,
  Text,
  Spinner,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import getVotingContract from "../../utils/votingContract";

const GetVotersDontVote = () => {
  const [roundIdSeminar, setRoundIdSeminar] = useState(""); // roundId cho seminar
  const [roundIdSpeaker, setRoundIdSpeaker] = useState(""); // roundId cho speaker
  const [votersDontVoteSeminar, setVotersDontVoteSeminar] = useState([]); // Danh sách voter không vote seminar
  const [votersDontVoteSpeaker, setVotersDontVoteSpeaker] = useState([]); // Danh sách voter không vote speaker
  const [isLoadingSeminar, setIsLoadingSeminar] = useState(false); // Trạng thái tải dữ liệu seminar
  const [isLoadingSpeaker, setIsLoadingSpeaker] = useState(false); // Trạng thái tải dữ liệu speaker
  const toast = useToast();

  const getVotersDontVoteForSeminar = async () => {
    setIsLoadingSeminar(true);
    try {
      const votingContract = await getVotingContract();
      const seminarVoters = await votingContract.getVotersDontVoteForSeminar(roundIdSeminar);
      setVotersDontVoteSeminar(seminarVoters);
    } catch (error) {
      console.error("Error fetching voters who didn’t vote for seminar:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách người không vote cho seminar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingSeminar(false);
    }
  };

  const getVotersDontVoteForSpeaker = async () => {
    setIsLoadingSpeaker(true);
    try {
      const votingContract = await getVotingContract();
      const speakerVoters = await votingContract.getVotersDontVoteForSpeaker(roundIdSpeaker);
      setVotersDontVoteSpeaker(speakerVoters);
    } catch (error) {
      console.error("Error fetching voters who didn’t vote for speaker:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách người không vote cho speaker.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingSpeaker(false);
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Phần dành cho Seminar */}
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Nhập Round ID để lấy danh sách người không vote cho Seminar
        </Text>
        <Input
          placeholder="Nhập Round ID"
          value={roundIdSeminar}
          onChange={(e) => setRoundIdSeminar(e.target.value)}
          mb={4}
        />
        <Button
          colorScheme="teal"
          onClick={getVotersDontVoteForSeminar}
          isLoading={isLoadingSeminar}
          loadingText="Đang tải..."
        >
          Lấy danh sách
        </Button>
        <Box mt={4} maxHeight="300px" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          {isLoadingSeminar ? (
            <Spinner size="lg" color="teal.500" />
          ) : (
            <List spacing={2}>
              {votersDontVoteSeminar.length === 0 ? (
                <Text>Không có dữ liệu.</Text>
              ) : (
                votersDontVoteSeminar.map((voter, index) => (
                  <ListItem key={index} borderBottom="1px solid #ccc" py={2}>
                    {voter}
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
      </Box>

      {/* Phần dành cho Speaker */}
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Nhập Round ID để lấy danh sách người không vote cho Speaker
        </Text>
        <Input
          placeholder="Nhập Round ID"
          value={roundIdSpeaker}
          onChange={(e) => setRoundIdSpeaker(e.target.value)}
          mb={4}
        />
        <Button
          colorScheme="blue"
          onClick={getVotersDontVoteForSpeaker}
          isLoading={isLoadingSpeaker}
          loadingText="Đang tải..."
        >
          Lấy danh sách
        </Button>
        <Box mt={4} maxHeight="300px" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          {isLoadingSpeaker ? (
            <Spinner size="lg" color="blue.500" />
          ) : (
            <List spacing={2}>
              {votersDontVoteSpeaker.length === 0 ? (
                <Text>Không có dữ liệu.</Text>
              ) : (
                votersDontVoteSpeaker.map((voter, index) => (
                  <ListItem key={index} borderBottom="1px solid #ccc" py={2}>
                    {voter}
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
      </Box>
    </VStack>
  );
};

export default GetVotersDontVote;
