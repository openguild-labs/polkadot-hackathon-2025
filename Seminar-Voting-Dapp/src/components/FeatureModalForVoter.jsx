import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton} from "@chakra-ui/react";
import VoteSeminar from "./VoterFeatures/VoteSeminar";
import VoteSpeaker from "./VoterFeatures/VoteSpeaker";
import SetNameYourself from "./VoterFeatures/SetNameYourSelf";
import RemoveVoteSeminar from "./VoterFeatures/RemoveVoteSeminar";
import RemoveVoteSpeaker from "./VoterFeatures/RemoveVoteSpeaker";
import GetSeminarDetail from "./VoterFeatures/GetSeminarDetail";
import ShowResults from "./VoterFeatures/ShowResults";

const FeatureModalForVoter = ({ featureId, onClose }) => {
  const renderFeatureContent = () => {
    switch (featureId) {
      case "voteSeminar":
        return <VoteSeminar />;
      case "voteSpeaker":
        return <VoteSpeaker />;
      case "setNameYourself":
        return <SetNameYourself />;
      case "removeVoteSeminar":
        return <RemoveVoteSeminar />;
        case "removeVoteSpeaker":
          return <RemoveVoteSpeaker />;
      case "getSeminarDetail":
        return <GetSeminarDetail />;
      case "showResults":
        return <ShowResults />;
      default:
        return <p>Chức năng không xác định.</p>;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết Tính Năng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderFeatureContent()}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeatureModalForVoter;