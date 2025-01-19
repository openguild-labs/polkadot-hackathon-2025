import React, { useState } from "react";
import { Input, Button, VStack, useToast, Heading, Box } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract";

const AddAdmin = () => {
  const [adminAddress, setAdminAddress] = useState(""); // Địa chỉ admin cần thêm
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Hàm thêm admin
  const handleAddAdmin = async () => {
    if (!adminAddress) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ admin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getWhitelistContract();
      const tx = await contract.addAdmin(adminAddress); // Gọi hàm addAdmin
      await tx.wait();

      toast({
        title: "Thành công",
        description: `Địa chỉ ${adminAddress} đã được thêm làm admin.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setAdminAddress("");
    } catch (error) {
      console.error("Lỗi khi thêm admin:", error);
      toast({
        title: "Thất bại",
        description: "Không thể thêm admin. Vui lòng thử lại.",
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
        Thêm Admin
      </Heading>
      <Box width="100%">
        <Input
          placeholder="Địa chỉ ví admin"
          value={adminAddress}
          onChange={(e) => setAdminAddress(e.target.value)}
          mb={2}
        />
        <Button
          colorScheme="teal"
          onClick={handleAddAdmin}
          isLoading={isLoading}
          loadingText="Đang thêm..."
        >
          Thêm Admin
        </Button>
      </Box>
    </VStack>
  );
};

export default AddAdmin;
