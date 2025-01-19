import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  useToast,
} from "@chakra-ui/react";
import getSBTContract from "../../utils/sbtContract";

const ManageSoul = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [soulId, setSoulId] = useState("");
  const [baseURI, getBaseURI] = useState("");
  const [soulMetadataURI, setSoulMetadataURI] = useState("");
  const toast = useToast();

  const mintSoul = async (to, soulId) => {
    try {
      const contract = await getSBTContract();
      const tx = await contract.mint(to, soulId);
      await tx.wait();
      console.log("Soul minted successfully");
      toast({
        title: "Thành công",
        description: "Soul đã được mint thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error minting soul:", error);
      toast({
        title: "Lỗi",
        description: "Không thể mint Soul. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getSoulMetadataURI = async (soulId) => {
    try {
      const contract = await getSBTContract();
      const uri = await contract.uri(soulId);
      console.log("Soul metadata URI:", uri);
      setSoulMetadataURI(uri);
      toast({
        title: "Thành công",
        description: `Metadata URI: ${uri}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching soul metadata URI:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy metadata URI. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const setBaseURI = async (baseURI) => {
    try {
      const contract = await getSBTContract();
      const tx = await contract.setBaseURI(baseURI);
      await tx.wait();
      console.log("Base URI set successfully");
      setSoulMetadataURI(baseURI); // Cập nhật baseURI mới để hiển thị
      toast({
        title: "Thành công",
        description: "Base URI đã được đặt thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error setting base URI:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đặt Base URI. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  return (
    <VStack spacing={4} align="start">
      <Button colorScheme="teal" onClick={onOpen} isLoading={isLoading} loadingText="Đang xử lý...">
        Quản Lý Soul
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quản Lý Soul</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
  <VStack spacing={6} align="stretch">
    {/* Khung điền tham số và nút cho hàm 1 */}
    <Box border="1px solid #e2e8f0" borderRadius="md" p={4}>
      <FormControl>
        <FormLabel>Địa chỉ nhận</FormLabel>
        <Input
          placeholder="Nhập địa chỉ"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Soul ID</FormLabel>
        <Input
          placeholder="Nhập Soul ID"
          value={soulId}
          onChange={(e) => setSoulId(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="teal"
        mt={4}
        onClick={() => mintSoul(toAddress, soulId)}
        isLoading={isLoading}
      >
        Mint Soul
      </Button>
    </Box>

    {/* Khung điền tham số và nút cho hàm 2 */}
    <Box border="1px solid #e2e8f0" borderRadius="md" p={4}>
      <FormControl>
        <FormLabel>Soul ID</FormLabel>
        <Input
          placeholder="Nhập Soul ID"
          value={soulId}
          onChange={(e) => setSoulId(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        mt={4}
        onClick={() => getSoulMetadataURI(soulId)}
        isDisabled={!soulId}
      >
        Lấy Metadata URI
      </Button>
      {soulMetadataURI && (
        <Box mt={4}>
          <FormLabel>Metadata URI:</FormLabel>
          <Box
            p={2}
            bg="gray.100"
            borderRadius="md"
            wordBreak="break-word"
          >
            {soulMetadataURI}
          </Box>
        </Box>
      )}
    </Box>

    {/* Khung điền tham số và nút cho hàm 3 */}
    <Box border="1px solid #e2e8f0" borderRadius="md" p={4}>
      <FormControl>
        <FormLabel>Base URI</FormLabel>
        <Input
          placeholder="Nhập Base URI"
          value={baseURI}
          onChange={(e) => getBaseURI(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="purple"
        mt={4}
        onClick={() => setBaseURI(baseURI)}
        isDisabled={!baseURI}
      >
        Đặt Base URI
      </Button>
    </Box>
  </VStack>
</ModalBody>

         
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ManageSoul;
