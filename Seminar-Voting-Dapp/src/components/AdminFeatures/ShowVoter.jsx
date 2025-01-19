import React, { useEffect, useState } from "react";
import { VStack, Heading, Box, Text, Spinner, useToast } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract"; // Utility để kết nối với contract

const ShowVoter = () => {
  const [voters, setVoters] = useState([]); // Danh sách voters
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const toast = useToast();

  // Hàm lấy danh sách voters từ contract
  const fetchVoters = async () => {
    try {
      const contract = await getWhitelistContract();
      const votersList = await contract.getVotersList(); // Lấy danh sách địa chỉ voters từ contract
      const voterDetails = await Promise.all(
        votersList.map(async (address) => {
          const name = await contract.getName(address); // Lấy tên từng voter
          return { address, name };
        })
      );
      setVoters(voterDetails); // Lưu danh sách voters vào state
    } catch (error) {
      console.error("Lỗi khi tải danh sách voters:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách voters. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  return (
    <VStack spacing={6} align="start">
      <Heading size="md" color="teal.500">
        Danh Sách Voters
      </Heading>
      {loading ? (
        <Spinner color="teal.500" />
      ) : voters.length === 0 ? (
        <Text>Không có voter nào trong danh sách.</Text>
      ) : (
        voters.map((voter, index) => (
          <Box
            key={voter.address}
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            width="100%"
          >
            <Text>
              <strong>STT:</strong> {index + 1}
            </Text>
            <Text>
              <strong>Địa chỉ:</strong> {voter.address}
            </Text>
            <Text>
              <strong>Tên:</strong> {voter.name || "Chưa đặt tên"}
            </Text>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default ShowVoter;