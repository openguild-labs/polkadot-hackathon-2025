import React, { useState } from "react";
import { Input, Button, VStack, useToast, Heading, Box } from "@chakra-ui/react";
import getVotingContract from "../../utils/votingContract";

const CreateAndRemoveRound = () => {
  const [startTime, setStartTime] = useState(""); // Thời gian bắt đầu
  const [endTime, setEndTime] = useState(""); // Thời gian kết thúc
  const [maxVotesSeminar, setMaxVotesSeminar] = useState(""); // Số phiếu tối đa cho Seminar
  const [maxVotesSpeaker, setMaxVotesSpeaker] = useState(""); // Số phiếu tối đa cho Speaker
  const [roundId, setRoundId] = useState(""); // ID vòng cần kết thúc
  const [newEndTime, setNewEndTime] = useState(""); // Thời gian kết thúc mới
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Hàm chuyển đổi thời gian sang timestamp
  const convertToTimestamp = (datetime) => {
    return Math.floor(new Date(datetime).getTime() / 1000);
  };

  // Hàm tạo vòng bỏ phiếu
  const handleCreateVotingRound = async () => {
    if (!startTime || !endTime || !maxVotesSeminar || !maxVotesSpeaker) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getVotingContract();
      const tx = await contract.createVotingRound(
        convertToTimestamp(startTime), // Chuyển đổi
        convertToTimestamp(endTime),   // Chuyển đổi
        parseInt(maxVotesSeminar),
        parseInt(maxVotesSpeaker)
      );
      await tx.wait();

      toast({
        title: "Thành công",
        description: "Vòng bỏ phiếu đã được tạo thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setStartTime("");
      setEndTime("");
      setMaxVotesSeminar("");
      setMaxVotesSpeaker("");
    } catch (error) {
      console.error("Lỗi khi tạo vòng bỏ phiếu:", error);
      toast({
        title: "Thất bại",
        description: "Không thể tạo vòng bỏ phiếu. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm kết thúc vòng bỏ phiếu
  const handleEndVotingRound = async () => {
    if (!roundId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ID vòng cần kết thúc.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getVotingContract();
      const tx = await contract.endVotingRound(parseInt(roundId));
      await tx.wait();

      toast({
        title: "Thành công",
        description: `Vòng bỏ phiếu ${roundId} đã được kết thúc.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setRoundId("");
    } catch (error) {
      console.error("Lỗi khi kết thúc vòng bỏ phiếu:", error);
      toast({
        title: "Thất bại",
        description: "Không thể kết thúc vòng bỏ phiếu. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm thay đổi thời gian kết thúc vòng bỏ phiếu
  const handleChangeVotingEndtime = async () => {
    if (!roundId || !newEndTime) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ID vòng và thời gian kết thúc mới.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getVotingContract();
      const tx = await contract.changeVotingEndtime(
        parseInt(roundId), // ID của vòng
        convertToTimestamp(newEndTime) // Thời gian kết thúc mới
      );
      await tx.wait();

      toast({
        title: "Thành công",
        description: `Thời gian kết thúc của vòng ${roundId} đã được thay đổi.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewEndTime("");
      setRoundId("");
    } catch (error) {
      console.error("Lỗi khi thay đổi thời gian kết thúc:", error);
      toast({
        title: "Thất bại",
        description: "Không thể thay đổi thời gian kết thúc. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6}>
      <Heading size="md" color="teal.500">
        Quản lý Vòng Bỏ Phiếu
      </Heading>

      {/* Tạo Vòng Bỏ Phiếu */}
      <Box width="100%">
        <Heading size="sm" mb={2}>
          Tạo Vòng Bỏ Phiếu
        </Heading>
        <Input
          placeholder="Thời gian bắt đầu (YYYY-MM-DD HH:mm:ss)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Thời gian kết thúc (YYYY-MM-DD HH:mm:ss)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Số phiếu tối đa cho Seminar"
          value={maxVotesSeminar}
          onChange={(e) => setMaxVotesSeminar(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Số phiếu tối đa cho Speaker"
          value={maxVotesSpeaker}
          onChange={(e) => setMaxVotesSpeaker(e.target.value)}
          mb={2}
        />
        <Button
          colorScheme="teal"
          onClick={handleCreateVotingRound}
          isLoading={isLoading}
          loadingText="Đang tạo..."
        >
          Tạo Vòng Bỏ Phiếu
        </Button>
      </Box>

      {/* Kết Thúc Vòng Bỏ Phiếu */}
      <Box width="100%">
        <Heading size="sm" mb={2}>
          Kết Thúc Vòng Bỏ Phiếu
        </Heading>
        <Input
          placeholder="ID vòng cần kết thúc"
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          mb={2}
        />
        <Button
          colorScheme="red"
          onClick={handleEndVotingRound}
          isLoading={isLoading}
          loadingText="Đang kết thúc..."
        >
          Kết Thúc Vòng
        </Button>
      </Box>

      {/* Thay Đổi Thời Gian Kết Thúc */}
      <Box width="100%">
        <Heading size="sm" mb={2}>
          Thay Đổi Thời Gian Kết Thúc
        </Heading>
        <Input
          placeholder="ID vòng cần thay đổi"
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Thời gian kết thúc mới (YYYY-MM-DD HH:mm:ss)"
          value={newEndTime}
          onChange={(e) => setNewEndTime(e.target.value)}
          mb={2}
        />
        <Button
          colorScheme="blue"
          onClick={handleChangeVotingEndtime}
          isLoading={isLoading}
          loadingText="Đang thay đổi..."
        >
          Thay Đổi Thời Gian Kết Thúc
        </Button>
      </Box>
    </VStack>
  );
};

export default CreateAndRemoveRound;
