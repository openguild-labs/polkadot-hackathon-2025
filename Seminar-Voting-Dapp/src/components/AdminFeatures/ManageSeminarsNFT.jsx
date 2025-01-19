import React, { useState } from "react";
import { Input, Button, VStack, useToast, Heading, Box } from "@chakra-ui/react";
import getVotingContract from "../../utils/votingContract";
import getSeminarNFTContract from "../../utils/seminarNFTContract";
import { use } from "react";
import { meta } from "@eslint/js";

const ManageSeminarsNFT = () => {
	const [name, setName] = useState(""); // Tên seminar
	const [description, setDescription] = useState(""); // Mô tả
	const [imageURL, setImageURL] = useState(""); 
	const [metadataURI, setMetadataURI] = useState("");
	const [speakerCount, setSpeakerCount] = useState("");
  const [speakers, setSpeakers] = useState([""]); // Mảng lưu tên các người tham gia

	const [seminarId, setSeminarId] = useState("");
	const [roundId, setRoundId] = useState("");

  const [startTime, setStartTime] = useState(""); // Thời gian bắt đầu
  const [endTime, setEndTime] = useState(""); // Thời gian kết thúc
  const [maxVotesSeminar, setMaxVotesSeminar] = useState(""); // Số phiếu tối đa cho Seminar
  const [maxVotesSpeaker, setMaxVotesSpeaker] = useState(""); // Số phiếu tối đa cho Speaker
  const [newEndTime, setNewEndTime] = useState(""); // Thời gian kết thúc mới
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Hàm chuyển đổi thời gian sang timestamp
  const convertToTimestamp = (datetime) => {
    return Math.floor(new Date(datetime).getTime() / 1000);
  };

  // Hàm tạo vòng bỏ phiếu
  const handleCreateSeminarNFT = async () => {
    if (!name || !description || !imageURL || !metadataURI) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getSeminarNFTContract();
      const tx = await contract.mintSeminar(
				name, 
				description,
				imageURL,
				"",
				metadataURI,
				speakers
      );
      await tx.wait();

      toast({
        title: "Thành công",
        description: "Seminar NFT được tạo thành côngcông",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName("");
      setDescription("");
      setImageURL("");
      setMetadataURI("");
			setSpeakerCount("");
			setSpeakers([""]);
    } catch (error) {
      console.error("Lỗi khi tạo vòng bỏ phiếu:", error);
      toast({
        title: "Thất bại",
        description: "Không thể tạo vòng bỏ phiếu. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm thay đổi thời gian kết thúc vòng bỏ phiếu
  const handleAddSeminarToRound = async () => {
    if (!roundId || !seminarId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ID vòng và ID seminar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getVotingContract();
      const tx = await contract.addSeminarToRound(
        parseInt(roundId), // ID của vòng
				parseInt(seminarId)// ID của seminar
      );
      await tx.wait();

      toast({
        title: "Thành công",
        description: `Đã thêm seminar ${seminarId} vào vòng bầu chọn số ${roundId}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSeminarId("");
      setRoundId("");
    } catch (error) {
      console.error("Lỗi khi thêm seminar vào vòng:", error);
      toast({
        title: "Thất bại",
        description: "Không thể thêm seminar này vào vòng bầu chọn. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Xử lý thay đổi số lượng người tham gia
  const handleSpeakerCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0; // Chuyển đổi giá trị về số nguyên
    setSpeakerCount(count);

    // Điều chỉnh số lượng mảng `speakers` khớp với số lượng người tham gia
    setSpeakers((prevSpeakers) => {
      const updatedSpeakers = [...prevSpeakers];
      while (updatedSpeakers.length < count) updatedSpeakers.push("");
      return updatedSpeakers.slice(0, count);
    });
  };

  // Xử lý thay đổi tên từng người tham gia
  const handleSpeakerNameChange = (index, value) => {
    setSpeakers((prevSpeakers) => {
      const updatedSpeakers = [...prevSpeakers];
      updatedSpeakers[index] = value;
      return updatedSpeakers;
    });
  };

  return (
    <VStack spacing={6}>
      <Heading size="md" color="teal.500">
        Quản lý các Seminar
      </Heading>

      {/* Tạo NFT mới */}
      <Box width="100%">
        <Heading size="sm" mb={2}>
          Tạo seminar NFT mới 
        </Heading>
        
        <Input
          placeholder="Tên Seminar"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="URL của ảnh"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="metadata URI"
          value={metadataURI}
          onChange={(e) => setMetadataURI(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Số lượng người trình bày"
          value={speakerCount}
          onChange={handleSpeakerCountChange}
          mb={2}
        />

      {Array.from({ length: speakerCount }, (_, index) => (
        <Input
          key={index}
          placeholder={`Địa chỉ người trình bày thứ ${index + 1}`}
          value={speakers[index] || ""}
          onChange={(e) => handleSpeakerNameChange(index, e.target.value)}
          mb={2}
        />
      ))}

        <Button
          colorScheme="teal"
          onClick={handleCreateSeminarNFT}
          isLoading={isLoading}
          loadingText="Đang tạo..."
        >
          Tạo NFT
        </Button>
      </Box>

      {/* Thêm NFT vào round */}
      <Box width="100%">
        <Heading size="sm" mb={2}>
          Thêm seminar vào vòng bầu chọn
        </Heading>
        <Input
          placeholder="Id seminar"
          value={seminarId}
          onChange={(e) => setSeminarId(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Id vòng bầu chọn"
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          mb={2}
        />
        <Button
          colorScheme="blue"
          onClick={handleAddSeminarToRound}
          isLoading={isLoading}
          loadingText="Đang thêm vào..."
        >
          Thêm seminar
        </Button>
      </Box>
    </VStack>
  );
};

export default ManageSeminarsNFT;