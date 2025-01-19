import React, { useState } from "react";
import {
  VStack,
  Box,
  Text,
  Spinner,
  Input,
  Button,
  Image,
  useToast,
} from "@chakra-ui/react";
import getSeminarNFTContract from "../../utils/seminarNFTContract";
import getWhitelistContract from "../../utils/whitelistContract";

const GetSeminarDetail = () => {
  const [seminarId, setSeminarId] = useState("");
  const [seminarDetails, setSeminarDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speakerNames, setSpeakerNames] = useState([]);
  const toast = useToast();

  const fetchSeminarDetails = async () => {
    if (!seminarId.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ID của seminar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setSeminarDetails(null);
    setSpeakerNames([]);

    try {
      const seminarNFTContract = await getSeminarNFTContract();
      const details = await seminarNFTContract.getSeminar(seminarId);

      if (!details) {
        throw new Error("Không tìm thấy thông tin seminar.");
      }

      console.log("Thông tin seminar trả về:", details);

      // Mapping
      const parsedDetails = {
        seminarId: seminarId,
        name: details[0],
        description: details[1],
        image: details[2],
        metadataURI: details[4],
        speakers: details[5],
      };

      setSeminarDetails(parsedDetails);

      if (parsedDetails.speakers) {
        const speakersProxy = parsedDetails.speakers; 
        const speakers = Array.isArray(speakersProxy)
          ? speakersProxy
          : Object.values(speakersProxy); 

        if (Array.isArray(speakers) && speakers.length > 0) {
          const whitelistContract = await getWhitelistContract();
          const names = await Promise.all(
            speakers.map(async (address) => {
              try {
                const name = await whitelistContract.getName(address);
                return { address, name: name || "Chưa đặt tên :(" };
              } catch (error) {
                console.error(`Lỗi khi lấy tên cho địa chỉ ${address}:`, error);
                return { address, name: "Không xác định :/" };
              }
            })
          );
          setSpeakerNames(names);
        } else {
          console.warn("Danh sách speakers trống hoặc không hợp lệ.");
          setSpeakerNames([]); // để mặc định nếu ch có speaker
        }
      } else {
        console.warn("Không tìm thấy trường speakers trong details.");
        setSpeakerNames([]); 
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin seminar:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lấy thông tin seminar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Chi Tiết Seminar
      </Text>

      <Input
        placeholder="Nhập ID Seminar"
        value={seminarId}
        onChange={(e) => setSeminarId(e.target.value)}
      />
      <Button colorScheme="blue" onClick={fetchSeminarDetails} isLoading={isLoading}>
        Lấy Thông Tin
      </Button>

      {isLoading ? (
        <Spinner size="lg" color="blue.500" alignSelf="center" />
      ) : seminarDetails ? (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50">
          <Text fontSize="lg" fontWeight="bold">ID Seminar:</Text>
          <Text fontWeight="bold">{seminarDetails.seminarId}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={4}>Tên Seminar:</Text>
          <Text>{seminarDetails.name}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={4}>Mô tả:</Text>
          <Text>{seminarDetails.description}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={4}>Hình ảnh:</Text>
          <Image src={seminarDetails.image} alt={seminarDetails.name} borderRadius="md" />

          <Text fontSize="lg" fontWeight="bold" mt={4}>Tên Diễn Giả:</Text>
          {speakerNames.length > 0 ? (
            <VStack spacing={2} align="start">
              {speakerNames.map((speaker, index) => (
                <Text key={index}>{`${speaker.name} (${speaker.address})`}</Text>
              ))}
            </VStack>
          ) : (
            <Text>Không có thông tin diễn giả.</Text>
          )}

          <Text fontSize="lg" fontWeight="bold" mt={4}>Metadata URI:</Text>
          <Text>{seminarDetails.metadataURI}</Text>
        </Box>
      ) : (
        <Text textAlign="center" color="gray.500">
          Không có thông tin seminar để hiển thị.
        </Text>
      )}
    </VStack>
  );
};

export default GetSeminarDetail;