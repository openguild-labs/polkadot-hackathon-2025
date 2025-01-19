import React, { useState, useEffect } from "react";
import { VStack, Select, Button, useToast, Text } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract";
import getVotingContract from "../../utils/votingContract";

const RemoveVoteSeminar = () => {
  //const [roundId, setRoundId] = useState(0);
  const [seminars, setSeminars] = useState([]);
  const [selectedSeminar, setSelectedSeminar] = useState("");
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

  // Lấy danh sách seminar từ contract
  const fetchSeminars = async () => {
    try {      
      const contract = await getWhitelistContract();
      const contract2 = await getVotingContract();
      const seminarIds = await contract2.getSeminarsHaveVoted(selectedRound); // Lấy seminarIds từ hàm getSpeakersAndSeminars
      const seminarList = seminarIds.map((id, index) => ({
        id: Number(id),
        name: `Seminar #${id}`, // Bạn có thể thay đổi cách lấy tên từ contract
      }));
      setSeminars(seminarList);
    } catch (error) {
      console.error("Error fetching seminars:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy danh sách seminar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm xử lý bỏ phiếu
  const handleRemoveVote = async () => {
    if (!selectedSeminar) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một seminar để huỷ phiếu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getVotingContract();
      await contract.removeVoteForSeminar(selectedRound, selectedSeminar); // Gọi hàm voteForSeminar từ contract
      toast({
        title: "Thành công",
        description: `Bạn đã hủy bỏ phiếu cho seminar: ${selectedSeminar}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedSeminar("");
    } catch (error) {
      console.error("Error voting for seminar:", error);
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

  // Lấy danh sách seminar khi component được mount
  
  useEffect(() => {
  fetchRounds();}, []);

  useEffect(() => {
    fetchSeminars();
    console.log("Selected Round changed to:", selectedRound);
  }, [selectedRound]);

  const handleRoundChange = (e) => {
    const newRoundId = e.target.value;  // Lấy giá trị round đã chọn
    setSelectedRound(newRoundId);  // Cập nhật selectedRound với giá trị mới
  };
  
  return (
    <VStack spacing={4}>
      <Text fontSize="lg" fontWeight="bold">
        Hủy bỏ phiếu cho Seminar
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
        placeholder={selectedSeminar ? selectedSeminar : "Chọn một seminar"}
        value={selectedSeminar}
        onChange={(e) => setSelectedSeminar(e.target.value)}
      >
        {seminars.map((seminars) => (
          <option key={seminars.id} value={seminars.id}>
            {seminars.name}
          </option>
        ))}
      </Select>
      <Button
        colorScheme="teal"
        onClick={handleRemoveVote}
        isLoading={isLoading}
        loadingText="Đang hủy phiếu..."
      >
        Hủy Phiếu
      </Button>
    </VStack>
  );
};

export default RemoveVoteSeminar;