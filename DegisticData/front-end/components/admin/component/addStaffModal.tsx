import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Form } from "@nextui-org/form";
import { Input } from "@chakra-ui/input";
import { StaffWriteFunc } from "@/const/common.const";
import { useWriteContract } from "wagmi";
import { StaffAbis } from "@/config/abis/staff";
import { ethers } from "ethers";

function AddStaffModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const { writeContractAsync } = useWriteContract();

  const addStaff = async () => {
    const defaultStationId = ethers.encodeBytes32String("default");
    
    const execute = await writeContractAsync({
      abi: StaffAbis,
      address: `0x${process.env.NEXT_PUBLIC_STAFF_SMART_CONTRACT_ADDRESS}`,
      functionName: StaffWriteFunc.ADDSTAFF,
      args: [
        defaultStationId,
        address
    ],
    });

    execute;
  };

  return (
    <div className="mt-5">
      <Button onPress={onOpen} className="bg-orange-400 text-white">
        Add staff
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Station
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full max-w-xs flex flex-col gap-4"
                  validationBehavior="native"
                  onReset={() => setAction("reset")}
                  onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(
                      new FormData(e.currentTarget)
                    );

                    setAction(`submit ${JSON.stringify(data)}`);
                  }}
                >
                  <span>Address</span>
                  <Input
                    isRequired
                    className="max-w-xs"
                    defaultValue="0xcdc54fBF11F9c28E55410af0227298098719D176"
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  className="bg-green-300"
                  variant="light"
                  onPress={addStaff}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AddStaffModal;
