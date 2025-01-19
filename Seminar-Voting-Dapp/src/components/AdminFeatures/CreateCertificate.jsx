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

const CreateCertificate = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    soulName: "",
    description: "",
    startDate: "", // YYYY-MM-DD HH:mm:ss
    endDate: "",   // YYYY-MM-DD HH:mm:ss
    metadataURI: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const convertToTimestamp = (datetime) => {
    return Math.floor(new Date(datetime).getTime() / 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createSoul = async () => {
    const { soulName, description, startDate, endDate, metadataURI } = formData;

    if (!soulName || !description || !startDate || !endDate || !metadataURI) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getSBTContract();
      const tx = await contract.createSoul(
        soulName,
        description,
        convertToTimestamp(startDate), // Chuyển đổi thời gian
        convertToTimestamp(endDate),   // Chuyển đổi thời gian
        metadataURI
      );
      await tx.wait();

      toast({
        title: "Thành công",
        description: "Soul đã được tạo thành công!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        soulName: "",
        description: "",
        startDate: "",
        endDate: "",
        metadataURI: "",
      });

      onClose();
    } catch (error) {
      console.error("Error creating soul:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo Soul. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="start">
      <Button colorScheme="teal" onClick={onOpen} isLoading={isLoading} loadingText="Đang xử lý...">
        Tạo Chứng Chỉ
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo Chứng Chỉ Mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Tên Soul</FormLabel>
                <Input
                  name="soulName"
                  placeholder="Nhập tên Soul"
                  value={formData.soulName}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mô tả</FormLabel>
                <Input
                  name="description"
                  placeholder="Nhập mô tả"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Ngày bắt đầu (YYYY-MM-DD HH:mm:ss)</FormLabel>
                <Input
                  name="startDate"
                  placeholder="Nhập ngày bắt đầu"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Ngày kết thúc (YYYY-MM-DD HH:mm:ss)</FormLabel>
                <Input
                  name="endDate"
                  placeholder="Nhập ngày kết thúc"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Metadata URI</FormLabel>
                <Input
                  name="metadataURI"
                  placeholder="Nhập metadata URI"
                  value={formData.metadataURI}
                  onChange={handleChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={createSoul} isLoading={isLoading} loadingText="Đang tạo...">
              Tạo
            </Button>
            <Button onClick={onClose} ml={3} isDisabled={isLoading}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default CreateCertificate;
