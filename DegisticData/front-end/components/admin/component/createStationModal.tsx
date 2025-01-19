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
import { ethers } from "ethers";
import { DeliveryAbis } from "@/config/abis/delivery";
import {
  DeliveryWriteFunc,
  StaffReadFunc,
  StaffWriteFunc,
} from "@/const/common.const";
import { useReadContract, useWriteContract } from "wagmi";
import { Select, SelectItem } from "@nextui-org/select";
import { StaffAbis } from "@/config/abis/staff";

function CreateStationModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { writeContractAsync } = useWriteContract();
  const [action, setAction] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [validators, setValidators] = useState<string[]>([]);
  const defaultStationId = ethers.encodeBytes32String("default");
  const [isUpdated, setUpdated] = useState(false);

  const list = useReadContract({
    chainId: 420420421,
    address: `0x${process.env.NEXT_PUBLIC_STAFF_SMART_CONTRACT_ADDRESS}`,
    functionName: StaffReadFunc.GETALLSTAFFSONSTATION,
    abi: StaffAbis,
    args: [defaultStationId],
  });

  const data =
    Array.isArray(list.data) && list.data.length > 0
      ? list.data.map((item) => item.staff_address)
      : [];

  const createStation = async () => {
    const bytesName = ethers.encodeBytes32String(name);

    const execute = await writeContractAsync({
      abi: DeliveryAbis,
      address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
      functionName: DeliveryWriteFunc.CREATESTATION,
      args: [bytesName, BigInt(0), validators],
    });

    setUpdated(true);
  };

  const updateStaff = async () => {
    const defaultStationId = ethers.encodeBytes32String("default");
    const id =
      Array.isArray(list.data) &&
      list.data.length > 0 &&
      list.data[list.data.length - 1].station_id;

    const execute = await writeContractAsync({
      abi: StaffAbis,
      address: `0x${process.env.NEXT_PUBLIC_STAFF_SMART_CONTRACT_ADDRESS}`,
      functionName: StaffWriteFunc.MODIFYSTAFF,
      args: [defaultStationId, `0x${id.substring(2)}`, validators[0]],
    });

    setUpdated(false);
  };
  return (
    <div className="mt-5">
      <Button onPress={onOpen} className="bg-green-400 text-white">
        Add station
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
                  <span>Name</span>
                  <Input
                    isRequired
                    className="max-w-xs"
                    defaultValue="junior"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span>Validators</span>
                  <Select className="max-w-xs" label="Select send station">
                    {data.map((item: any, index: number) => (
                      <SelectItem
                        key={index}
                        onPress={() => setValidators([...validators, item])}
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                </Form>
              </ModalBody>
              <ModalFooter>
                {!isUpdated ? (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={createStation}
                  >
                    Create
                  </Button>
                ) : (
                  <Button
                    color="success"
                    variant="light"
                    onPress={updateStaff}
                  >
                    Update
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateStationModal;
