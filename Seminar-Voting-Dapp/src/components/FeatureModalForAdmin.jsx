import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import AddVoter from "./AdminFeatures/AddVoter";
import RemoveVoter from "./AdminFeatures/RemoveVoter";
import CreateAndRemoveRound from "./AdminFeatures/CreateAndRemoveRound";
import AddAdmin from "./AdminFeatures/AddAdmin";
import ShowAllRound from "./AdminFeatures/ShowAllRound";
import CreateCertificate from "./AdminFeatures/CreateCertificate"; 
import ManageSoul from "./AdminFeatures/ManageSoul";
import GetVotersDontVote from "./AdminFeatures/GetVotersDontVote.jsx";
import GetResult from "./AdminFeatures/getResult";
import ManageSeminarsNFT from "./AdminFeatures/ManageSeminarsNFT.jsx";
import RemoveAdmin from "./AdminFeatures/RemoveAdmin.jsx";
import ShowVoter from "./AdminFeatures/ShowVoter";
import ShowAdmin from "./AdminFeatures/ShowAdmin";
import SetNameAdmin from "./AdminFeatures/SetNameAdmin";
import ChooseBest from "./AdminFeatures/ChooseBest.jsx";



const FeatureModalForAdmin = ({ featureId, onClose }) => {
  const renderFeatureContent = () => {
    switch (featureId) {
      case "addVoter":
        return <AddVoter />;
      case "removeVoter":
        return <RemoveVoter />;
      case "createAndRemoveRound":
        return <CreateAndRemoveRound />;
      case "manageSeminarsNFT":
        return <ManageSeminarsNFT />;
      case "addAdmin":
        return <AddAdmin />;
      case "showAllRound":
        return <ShowAllRound />;
      case "getVotersDontVote":
        return <GetVotersDontVote />;
      case "getResult":
        return <GetResult />;
      case "createCertificate": 
        return <CreateCertificate />; 
      case "manageSoul":
        return <ManageSoul />;
      case "removeAdmin":
        return <RemoveAdmin/>;
      case "showVoter":
        return <ShowVoter/>;
      case "showAdmin":
        return <ShowAdmin/>;
      case "setNameAdmin":
        return <SetNameAdmin/>
      case "manageSeminarsNFT":
        return <ManageSeminarsNFT/>
      case "chooseBest":
        return <ChooseBest/>
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

export default FeatureModalForAdmin;