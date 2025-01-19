import React, { useState } from "react";
import { Input, Button, VStack, useToast } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract";

const AddVoter = () => {
  const [voterAddress, setVoterAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAddVoter = async () => {
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
      const contract = await getWhitelistContract();
      await contract.addVoter(voterAddress); // Gọi hàm trên hợp đồng
      toast({
        title: "Thành công",
        description: `Đã thêm voter: ${voterAddress}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setVoterAddress("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Thất bại",
        description: "Không thể thêm voter.",
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
        colorScheme="teal"
        onClick={handleAddVoter}
        isLoading={isLoading}
        loadingText="Đang thêm..."
      >
        Thêm Voter
      </Button>
    </VStack>
  );
};

export default AddVoter;
