import React, { useState } from "react";
import { Box, Button, Heading, Grid } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeatureModalForVoter from "../components/FeatureModalForVoter";
import { FaVoteYea, FaUserEdit, FaUndo, FaInfoCircle } from "react-icons/fa";

const VoterPage = () => {
  const [currentFeature, setCurrentFeature] = useState(null);

  const features = [
    { id: "voteSeminar", label: "VOTE FOR SEMINAR", icon: <FaVoteYea /> },
    { id: "voteSpeaker", label: "VOTE FOR SPEAKER", icon: <FaVoteYea /> },
    { id: "setNameYourself", label: "SET YOUR NAME", icon: <FaUserEdit /> },
    { id: "removeVoteSeminar", label: "REMOVE VOTE FOR SEMINAR", icon: <FaUndo /> },
    { id: "removeVoteSpeaker", label: "REMOVE VOTE FOR SPEAKER", icon: <FaUndo /> },
    { id: "getSeminarDetail", label: "SEMINAR DETAILS", icon: <FaInfoCircle /> },
  ];

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          opacity: 1.0,
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Navbar isLoggedIn={true} title="Trang Voter" />
      <Box
        as="main"
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        {/* Heading */}
        <Box
          bg="rgba(0, 0, 0, 0.7)"
          borderRadius="md"
          p={4}
          mb={8}
          boxShadow="lg"
        >
          <Heading
            color="yellow.300"
            fontSize="4xl"
            fontWeight="extrabold"
            textAlign="center"
          >
            Voter Features
          </Heading>
        </Box>

        {/* Feature Grid */}
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)", // 1 cột trên màn hình nhỏ
            md: "repeat(2, 1fr)", // 2 cột trên màn hình trung bình
            lg: "repeat(3, 1fr)", // 3 cột trên màn hình lớn
          }}
          gap={6} // Khoảng cách giữa các nút
          px={4}
          justifyContent="center"
        >
          {features.map((feature) => (
            <Button
              key={feature.id}
              leftIcon={feature.icon}
              colorScheme="teal"
              size="md" // Kích thước nhỏ hơn
              minWidth="180px" // Chiều rộng tối thiểu
              minHeight="70px" // Chiều cao tối thiểu
              fontSize="lg" // Kích thước chữ nhỏ hơn
              fontWeight="bold"
              borderRadius="md"
              boxShadow="lg"
              textAlign="center"
              whiteSpace="normal"
              overflow="hidden"
              textOverflow="ellipsis"
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "2xl",
                backgroundColor: "teal.600",
              }}
              _active={{
                transform: "scale(0.95)",
                backgroundColor: "teal.700",
              }}
              onClick={() => setCurrentFeature(feature.id)}
            >
              {feature.label}
            </Button>
          ))}
        </Grid>
      </Box>
      <Footer />
      {currentFeature && (
        <FeatureModalForVoter
          featureId={currentFeature}
          onClose={() => setCurrentFeature(null)}
        />
      )}
    </Box>
  );
};

export default VoterPage;