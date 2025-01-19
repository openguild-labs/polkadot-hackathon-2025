import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useState } from "react";
import { Form } from "@nextui-org/form";
import { Input } from "@chakra-ui/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useAccount, useReadContract } from "wagmi";
import { DeliveryAbis } from "@/config/abis/delivery";
import { ethers } from "ethers";
import { SubmitButton } from "./SubmitButton";
import { CreateOrder } from "@/types";
import { DeliveryReadFunc } from "@/const/common.const";

export default function OrderModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<string>("");
  const [name, setName] = useState<any>("");
  const [receiver, setReceiver] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const account = useAccount();

  const list = useReadContract({
    chainId: 420420421,
    address: `0x${process.env.NEXT_PUBLIC_DELIVERY_SMART_CONTRACT_ADDRESS}`,
    functionName: DeliveryReadFunc.GETALLSTATION,
    abi: DeliveryAbis,
  });

  const data =
    Array.isArray(list.data) &&
    list.data.length > 0 &&
    list.data.map((item) => ({
      id: item.station_id,
      name: ethers.decodeBytes32String(item.name),
      orderCount: Number(item.total_order),
      validators: Number(item.validitors.length),
    }));

  const params: CreateOrder = {
    _station_ids: [`0x${from.substring(2)}`, `0x${to.substring(2)}`],
    _name: ethers.encodeBytes32String(name),
    _sender: `0x${account.address?.substring(2)}`,	
    _receiver: receiver,
  };

  return (
    <>
      <Button onPress={onOpen}>Add order</Button>
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
                New order
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
                  <span>Receiver address</span>
                  <Input
                    isRequired
                    className="max-w-xs"
                    defaultValue="0x0"
                    type="text"
                    onChange={(e) => setReceiver(e.target.value)}
                  />
                  <span>From</span>
                  <select className="max-w-xs" onChange={(e) => setFrom(e.target.value)} defaultValue={"Select station"}>
                    {Array.isArray(data) &&
                      data.length > 0 &&
                      data.map((item: any) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <span>To</span>
                  <select className="max-w-xs" onChange={(e) => setTo(e.target.value)} defaultValue={"Select station"}>
                    {Array.isArray(data) &&
                      data.length > 0 &&
                      data.map((item: any) => (
                        <option
                          key={item.id}
                          value={item.id}
                          className="w-full bg-transparent p-2 border-1 rounded-xl"
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <SubmitButton data={params} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
