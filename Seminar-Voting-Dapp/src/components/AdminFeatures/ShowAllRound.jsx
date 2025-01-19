import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Heading, VStack, Text, useToast } from "@chakra-ui/react";
import getVotingContract from "../../utils/votingContract";

const ShowAllRound = () => {
  const [rounds, setRounds] = useState([]); // Lưu danh sách vòng bỏ phiếu
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const toast = useToast();

  // Hàm lấy thông tin các vòng bỏ phiếu từ smart contract
  const fetchRounds = async () => {
    try {
      const contract = await getVotingContract(); // Kết nối với smart contract
      const nextRoundId = await contract.nextRoundId(); // Lấy tổng số vòng bỏ phiếu (có thể là number hoặc string)

      // Kiểm tra kiểu dữ liệu của nextRoundId
      const totalRounds = typeof nextRoundId === "number" ? nextRoundId : parseInt(nextRoundId.toString());

      const roundsData = [];

      for (let i = 1; i <= totalRounds; i++) {
        const round = await contract.votingRounds(i); // Gọi hàm để lấy dữ liệu từng vòng
        const seminarIds = await contract.getSpeakersAndSeminars(i); // Lấy thông tin seminar và speaker

        roundsData.push({
          id: i,
          startTime: new Date(parseInt(round.startTime.toString()) * 1000).toLocaleString(), // Chuyển đổi timestamp
          endTime: new Date(parseInt(round.endTime.toString()) * 1000).toLocaleString(),
          maxVotesPerVoterForSeminar: round.maxVotesPerVoterForSeminar.toString(), // Chuyển đổi BigNumber
          maxVotesPerVoterForSpeaker: round.maxVotesPerVoterForSpeaker.toString(), // Chuyển đổi BigNumber
          isActive: round.isActive, // Boolean trạng thái
          seminarIds: seminarIds[1], // Mảng seminar IDs
          speakersInRound: seminarIds[0], // Mảng speakers
        });
      }

      setRounds(roundsData); // Cập nhật danh sách vòng vào state
    } catch (error) {
      console.error("Lỗi khi tải thông tin vòng bỏ phiếu:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin vòng bỏ phiếu. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Dừng trạng thái loading
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  return (
    <VStack spacing={6}>
      <Heading size="md" color="teal.500">
        Danh sách tất cả các vòng bỏ phiếu
      </Heading>

      {isLoading ? (
        <Spinner size="xl" color="teal.500" />
      ) : (
        <Box width="100%" overflowX="auto">
          {rounds.length === 0 ? (
            <Text>Hiện không có vòng bỏ phiếu nào.</Text>
          ) : (
            <Table variant="simple" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Thời gian bắt đầu (MM-DD-YYYY)</Th>
                  <Th>Thời gian kết thúc (MM-DD-YYYY)</Th>
                  <Th>Số phiếu tối đa (Seminar)</Th>
                  <Th>Số phiếu tối đa (Speaker)</Th>
                  <Th>Trạng thái</Th>
                  <Th>Seminar IDs</Th>
                  <Th>Speakers</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rounds.map((round) => (
                  <Tr key={round.id}>
                    <Td>{round.id}</Td>
                    <Td>{round.startTime}</Td>
                    <Td>{round.endTime}</Td>
                    <Td>{round.maxVotesPerVoterForSeminar}</Td>
                    <Td>{round.maxVotesPerVoterForSpeaker}</Td>
                    <Td>{round.isActive ? "Đang hoạt động" : "Đã kết thúc"}</Td>
                    <Td>{round.seminarIds.join(", ")}</Td>
                    <Td>{round.speakersInRound.join(", ")}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      )}
    </VStack>
  );
};

export default ShowAllRound;
