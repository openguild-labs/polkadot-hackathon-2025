import React, { useState } from "react";
import { Input, Button, VStack, useToast, Heading } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract"; // Utility để kết nối với contract
import { accountAddress } from "../../pages/LoginPage";

const SetNameAdmin = () => {
  const [name, setName] = useState(""); // Tên của admin
  const [isLoading, setIsLoading] = useState(false); // Trạng thái đang xử lý
  const toast = useToast();

  // Hàm đặt tên cho Admin
  const handleSetName = async () => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên hợp lệ.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!accountAddress) {
      toast({
        title: "Lỗi",
        description: "Không thể xác định địa chỉ tài khoản. Vui lòng đăng nhập lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getWhitelistContract();

      // Gửi giao dịch setName
      const tx = await contract.setName(accountAddress, name);
      await tx.wait();

      toast({
        title: "Thành công",
        description: "Tên của bạn đã được đặt thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName(""); // Reset input sau khi đặt tên thành công
    } catch (error) {
      console.error("Lỗi khi đặt tên:", error);
      toast({
        title: "Thất bại",
        description:
          "Không thể đặt tên. Vui lòng kiểm tra kết nối hoặc thử lại sau.",
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
        Đặt Tên Admin
      </Heading>
      <Input
        placeholder="Nhập tên của bạn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        mb={2}
      />
      <Button
        colorScheme="blue"
        onClick={handleSetName}
        isLoading={isLoading}
        loadingText="Đang xử lý..."
      >
        Đặt Tên
      </Button>
    </VStack>
  );
};

export default SetNameAdmin;