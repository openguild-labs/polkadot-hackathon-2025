import React, { useState } from "react";
import { Input, Button, VStack, useToast, Heading, Box } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract";
import getVotingContract from "../../utils/votingContract";

const RemoveAdmin = () => {
  const [adminAddress, setAdminAddress] = useState(""); // Địa chỉ admin cần xóa
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const toast = useToast();

  // Hàm xử lý xóa admin
  const handleRemoveAdmin = async () => {
    if (!adminAddress) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ của admin cần xóa.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getWhitelistContract(); // Kết nối với smart contract
      const tx = await contract.removeAdmin(adminAddress); // Gọi hàm removeAdmin trên smart contract
      await tx.wait(); // Chờ giao dịch hoàn tất

      toast({
        title: "Thành công",
        description: `Admin với địa chỉ ${adminAddress} đã được xóa.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setAdminAddress(""); // Xóa input sau khi thực hiện thành công
    } catch (error) {
      console.error("Lỗi khi xóa admin:", error);
      toast({
        title: "Thất bại",
        description: "Không thể xóa admin. Vui lòng thử lại.",
        status: "error",    
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <VStack spacing={6}>
      <Heading size="md" color="teal.500">
        Xóa Admin
      </Heading>

      <Box width="100%">
        <Input
          placeholder="Địa chỉ admin cần xóa (0x...)"
          value={adminAddress}
          onChange={(e) => setAdminAddress(e.target.value)}
          mb={4}
        />
        <Button
          colorScheme="red"
          onClick={handleRemoveAdmin}
          isLoading={isLoading}
          loadingText="Đang xóa..."
        >
          Xóa Admin
        </Button>
      </Box>
    </VStack>
  );
};

export default RemoveAdmin;