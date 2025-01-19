import React, { useState, useEffect } from "react";
import { VStack, Select, Button, useToast, Text } from "@chakra-ui/react";
import getVotingContract from "../../utils/votingContract"; 
import getWhitelistContract from "../../utils/whitelistContract"; 

const RemoveVoteSpeaker = () => {
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  // Lấy danh sách round còn hoạt động từ contract
  const fetchRounds = async () => {
    try {
      const contract = await getVotingContract();
      const roundIds = await contract.getInActiveRounds(); // Lấy seminarIds từ hàm getSpeakersAndSeminars
      const roundList = roundIds.map((id, index) => ({
        id: Number(id),
        name: `Round #${id}`,
      }));
      setRounds(roundList);
    } catch (error) {
      console.error("Error fetching seminars:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách round đang hoạt động.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchSpeakers = async () => {
    try {
      const votingContract = await getVotingContract();
      const whitelistContract = await getWhitelistContract();

      const speakersInRound = await votingContract.getSpeakersHaveVoted(selectedRound);

      // Lấy tên cho từng speaker
      const speakersWithNames = await Promise.all(
        speakersInRound.map(async (speakerAddress) => {
          const name = await whitelistContract.getName(speakerAddress);
          return { address: speakerAddress, name };
        })
      );

      setSpeakers(speakersWithNames);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách speaker.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm xử lý bỏ phiếu cho speaker
  const handleVote = async () => {
    if (!selectedSpeaker) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một speaker để hủy phiếu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const votingContract = await getVotingContract();
      const tx = await votingContract.removeVoteForSpeaker(selectedRound, selectedSpeaker);
      await tx.wait(); 

      toast({
        title: "Thành công",
        description: `Bạn đã hủy bỏ phiếu cho speaker: ${selectedSpeaker}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Cập nhật lại danh sách speakers (nếu cần)
      fetchSpeakers();
    } catch (error) {
      console.error("Error remove vote for speaker:", error);
      toast({
        title: "Thất bại",
        description: "Không thể hủy phiếu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  fetchRounds();}, []);

  useEffect(() => {
    fetchSpeakers();
    console.log("Selected Round changed to:", selectedRound);
  }, [selectedRound]);

  const handleRoundChange = (e) => {
    const newRoundId = e.target.value;  // Lấy giá trị round đã chọn
    setSelectedRound(newRoundId);  // Cập nhật selectedRound với giá trị mới
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="lg" fontWeight="bold">
        Hủy bỏ phiếu cho Speaker
      </Text>
      <Select
        placeholder={selectedRound ? `Round #${selectedRound}` : "Chọn một round"}
        value={selectedRound}
        onChange={handleRoundChange}
      >
        {rounds.map((rounds) => (
          <option key={rounds.id} value={rounds.id}>
            {rounds.name}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Chọn một speaker"
        value={selectedSpeaker}
        onChange={(e) => setSelectedSpeaker(e.target.value)}
      >
        {speakers.map((speakers) => (
          <option key={speakers.address} value={speakers.address}>
            {speakers.name} ({speakers.address})
          </option>
        ))}
      </Select>
      <Button
        colorScheme="blue"
        onClick={handleVote}
        isLoading={isLoading}
        loadingText="Đang hủy phiếu..."
      >
        Hủy Phiếu
      </Button>
    </VStack>
  );
};

export default RemoveVoteSpeaker;