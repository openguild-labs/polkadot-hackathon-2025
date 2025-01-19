import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaTrophy, FaCrown, FaMedal } from "react-icons/fa";

const ChooseBest = () => {
  const [roundNumber, setRoundNumber] = useState(""); // Số thứ tự round
  const [top1, setTop1] = useState({ count: 0, names: [] });
  const [top2, setTop2] = useState({ count: 0, names: [] });
  const [top3, setTop3] = useState({ count: 0, names: [] });
  const [isEditing, setIsEditing] = useState(true); // Bắt đầu ở chế độ chỉnh sửa
  const [savedData, setSavedData] = useState(null); // Lưu trữ dữ liệu đã lưu

  const handleUpdateTop = (level, index, value) => {
    const updateFunction =
      level === "top1" ? setTop1 : level === "top2" ? setTop2 : setTop3;

    const currentData =
      level === "top1" ? top1 : level === "top2" ? top2 : top3;

    const updatedNames = [...currentData.names];
    updatedNames[index] = value;

    updateFunction({ ...currentData, names: updatedNames });
  };

  const handleUpdateCount = (level, value) => {
    const count = parseInt(value) || 0;
    const updateFunction =
      level === "top1" ? setTop1 : level === "top2" ? setTop2 : setTop3;

    const currentData =
      level === "top1" ? top1 : level === "top2" ? top2 : top3;

    const updatedNames = new Array(count).fill("");

    updateFunction({ ...currentData, count, names: updatedNames });
  };

  const handleSaveResults = () => {
    if (!roundNumber) {
      alert("Vui lòng nhập số thứ tự round.");
      return;
    }
    const data = {
      roundNumber,
      top1,
      top2,
      top3,
    };

    // Lưu dữ liệu vào localStorage
    localStorage.setItem("votingResults", JSON.stringify(data));

    // Lưu dữ liệu vào state để hiển thị
    setSavedData(data);
    setIsEditing(false);
  };

  const handleEditResults = () => {
    if (savedData) {
      setRoundNumber(savedData.roundNumber);
      setTop1(savedData.top1);
      setTop2(savedData.top2);
      setTop3(savedData.top3);
    }
    setIsEditing(true);
  };

  return (
    <Box
      bg="whiteAlpha.900"
      p={8}
      borderRadius="lg"
      boxShadow="xl"
      maxWidth="800px"
      mx="auto"
      mt={8}
    >
      <Heading size="lg" textAlign="center" mb={6} color="teal.600">
        Nhập Kết Quả Round
      </Heading>
      <VStack spacing={6} align="stretch">
        {/* Nhập số thứ tự Round */}
        <HStack>
          <Text fontWeight="bold">Số thứ tự Round:</Text>
          <Input
            placeholder="Nhập số thứ tự round"
            value={roundNumber}
            onChange={(e) => setRoundNumber(e.target.value)}
            disabled={!isEditing}
          />
        </HStack>

        {/* Top 1 */}
        <Box>
          <HStack mb={2}>
            <Icon as={FaCrown} color="gold" w={6} h={6} />
            <Text fontWeight="bold" fontSize="lg">
              Top 1 (Số người: {top1.count})
            </Text>
          </HStack>
          <Input
            placeholder="Số người Top 1"
            type="number"
            value={top1.count}
            onChange={(e) => handleUpdateCount("top1", e.target.value)}
            disabled={!isEditing}
          />
          <VStack mt={3} spacing={3} align="stretch">
            {top1.names.map((name, index) => (
              <Input
                key={index}
                placeholder={`Tên Top 1 #${index + 1}`}
                value={name}
                onChange={(e) =>
                  handleUpdateTop("top1", index, e.target.value)
                }
                disabled={!isEditing}
              />
            ))}
          </VStack>
        </Box>

        {/* Top 2 */}
        <Box>
          <HStack mb={2}>
            <Icon as={FaMedal} color="silver" w={6} h={6} />
            <Text fontWeight="bold" fontSize="lg">
              Top 2 (Số người: {top2.count})
            </Text>
          </HStack>
          <Input
            placeholder="Số người Top 2"
            type="number"
            value={top2.count}
            onChange={(e) => handleUpdateCount("top2", e.target.value)}
            disabled={!isEditing}
          />
          <VStack mt={3} spacing={3} align="stretch">
            {top2.names.map((name, index) => (
              <Input
                key={index}
                placeholder={`Tên Top 2 #${index + 1}`}
                value={name}
                onChange={(e) =>
                  handleUpdateTop("top2", index, e.target.value)
                }
                disabled={!isEditing}
              />
            ))}
          </VStack>
        </Box>

        {/* Top 3 */}
        <Box>
          <HStack mb={2}>
            <Icon as={FaTrophy} color="bronze" w={6} h={6} />
            <Text fontWeight="bold" fontSize="lg">
              Top 3 (Số người: {top3.count})
            </Text>
          </HStack>
          <Input
            placeholder="Số người Top 3"
            type="number"
            value={top3.count}
            onChange={(e) => handleUpdateCount("top3", e.target.value)}
            disabled={!isEditing}
          />
          <VStack mt={3} spacing={3} align="stretch">
            {top3.names.map((name, index) => (
              <Input
                key={index}
                placeholder={`Tên Top 3 #${index + 1}`}
                value={name}
                onChange={(e) =>
                  handleUpdateTop("top3", index, e.target.value)
                }
                disabled={!isEditing}
              />
            ))}
          </VStack>
        </Box>

        {/* Nút Lưu và Sửa */}
        <HStack mt={6} justify="center">
          {isEditing ? (
            <Button colorScheme="teal" onClick={handleSaveResults}>
              Lưu Kết Quả
            </Button>
          ) : (
            <Button colorScheme="teal" onClick={handleEditResults}>
              Sửa Kết Quả
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChooseBest;