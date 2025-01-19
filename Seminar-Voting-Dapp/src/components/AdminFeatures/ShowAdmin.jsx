import React, { useEffect, useState } from "react";
import { VStack, Heading, Box, Text, Spinner, useToast } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract"; // Utility để kết nối với contract

const ShowAdmin = () => {
  const [admins, setAdmins] = useState([]); // Danh sách admins
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const toast = useToast();

  // Hàm lấy danh sách admins từ contract
  const fetchAdmins = async () => {
    try {
      const contract = await getWhitelistContract();
      const votersList = await contract.getVotersList(); // Lấy danh sách địa chỉ
      const adminDetails = [];

      // Lọc ra các admin
      for (let address of votersList) {
        const isAdmin = await contract.isAdmin(address); // Kiểm tra địa chỉ có phải admin không
        if (isAdmin) {
          const name = await contract.getName(address); // Lấy tên của admin
          adminDetails.push({ address, name });
        }
      }

      setAdmins(adminDetails); // Lưu danh sách admin vào state
    } catch (error) {
      console.error("Lỗi khi tải danh sách admins:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách admins. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <VStack spacing={6} align="start">
      <Heading size="md" color="teal.500">
        Danh Sách Admins
      </Heading>
      {loading ? (
        <Spinner color="teal.500" />
      ) : admins.length === 0 ? (
        <Text>Không có admin nào trong danh sách.</Text>
      ) : (
        admins.map((admin, index) => (
          <Box
            key={admin.address}
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
              <strong>Địa chỉ:</strong> {admin.address}
            </Text>
            <Text>
              <strong>Tên:</strong> {admin.name || "Chưa đặt tên"}
            </Text>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default ShowAdmin;