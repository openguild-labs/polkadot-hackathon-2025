import React, { useState } from "react";
import { Input, Button, VStack, useToast } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract";

const RemoveVoter = () => {
  const [voterAddress, setVoterAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleRemoveVoter = async () => {
    if (!voterAddress) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ voter.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Kết nối hợp đồng
      const contract = await getWhitelistContract();

      // Gọi hàm xóa voter
      await contract.removeVoter(voterAddress);

      toast({
        title: "Thành công",
        description: `Đã xóa voter: ${voterAddress}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset input
      setVoterAddress("");
    } catch (error) {
      console.error("Lỗi khi xóa voter:", error);
      toast({
        title: "Thất bại",
        description: "Không thể xóa voter. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4}>
      <Input
        placeholder="Địa chỉ ví voter"
        value={voterAddress}
        onChange={(e) => setVoterAddress(e.target.value)}
      />
      <Button
        colorScheme="red"
        onClick={handleRemoveVoter}
        isLoading={isLoading}
        loadingText="Đang xóa..."
      >
        Xóa Voter
      </Button>
    </VStack>
  );
};

export default RemoveVoter;
