import React, { useState, useEffect } from "react";
import { VStack, Input, Button, useToast, Text, Box } from "@chakra-ui/react";
import getWhitelistContract from "../../utils/whitelistContract";
import { accountAddress } from "../../pages/LoginPage";

const SetNameYourself = () => {
  const [currentName, setCurrentName] = useState("");
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const findName = async () => {
    const whitelistContract = await getWhitelistContract();
    setCurrentName(await whitelistContract.getName(accountAddress));
  }
  
  useEffect(() => {
    findName();
    ;}, []);

  // Hàm xử lý đặt tên mới
  const handleSetName = async () => {
    if (!newName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mới.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }


    setIsLoading(true);
    try {
      const whitelistContract = await getWhitelistContract();
      const tx = await whitelistContract.setName(accountAddress, newName);
      await tx.wait(); 

      toast({
        title: "Thành công",
        description: `Bạn đã đặt tên thành công: ${newName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setCurrentName(newName);
      setNewName("");
    } catch (error) {
      console.error("Error setting name:", error);
      toast({
        title: "Thất bại",
        description: "Không thể đặt tên.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mb={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Đặt Tên Cho Bản Thân
        </Text>
        <Text>
          Tên hiện tại: <strong>{currentName || "Chưa đặt tên"}</strong>
        </Text>
        <Input
          placeholder="Nhập tên mới"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button
          colorScheme="purple"
          onClick={handleSetName}
          isLoading={isLoading}
          loadingText="Đang đặt tên..."
        >
          Đặt Tên
        </Button>
      </VStack>
    </Box>
  );
};

export default SetNameYourself;