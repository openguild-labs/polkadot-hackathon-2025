'use client';
import CalendarIcon from "@/components/common/icons/CalendarIcon";
import { formatDate } from "@/utils/formatter";
import { Button, Divider, Typography } from "antd"
import Image from "next/image"

const { Title, Text } = Typography;

export default function MyRentalsPage() {
    return (
        <div className="flex flex-col gap-8">
            <section>
                <Title level={1}>My rentals</Title>
                <span className="text-muted">View and manage your rental assets</span>
            </section>
            <div className="flex gap-8 w-full">
                <div className="flex flex-col py-5 rounded-t-xl bg-light-secondary flex-1">
                    <div className="flex items-center gap-4 mx-5">
                        <Image
                            src="https://lootrush-website-assets.s3.us-east-1.amazonaws.com/images/games/axie-infinity-axies/Card.png"
                            alt=""
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                        <div className="flex flex-col font-bold flex-1 text-base">
                            <Text>Axie Infinity: Axies</Text>
                            <Text>1 assets</Text>
                        </div>
                        <Button type="primary" className="font-bold py-5 rounded-lg">Return assets</Button>
                    </div>
                    <Divider className="bg-gray-500" />
                    <div className="mx-3 flex gap-4 items-center">
                        <Image
                            src={"https://image-cdn.lootrush.com/unsafe/311x0/smart/filters:format(webp)/https%3A%2F%2Faxiecdn.axieinfinity.com%2Faxies%2F11849301%2Faxie%2Faxie-full-transparent.png"}
                            alt=""
                            width={100}
                            height={100}
                        // className="border-2 border-gray-600 rounded-lg"
                        />
                        <div className="flex flex-col flex-1">
                            <Title level={3}>Axie #11849301</Title>
                            <div className="flex gap-2 items-center">
                                <CalendarIcon size={15} />
                                <Text className="text-muted">{formatDate(new Date())}</Text>
                            </div>
                            <div className="flex gap-2 items-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    width={15}
                                    height={15}
                                    fill="currentColor"
                                >
                                    <path d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Zm4-8c0,1.654-1.346,3-3,3v1c0,.553-.447,1-1,1s-1-.447-1-1v-1h-.268c-1.067,0-2.063-.574-2.598-1.499-.277-.479-.113-1.09,.364-1.366,.479-.279,1.091-.113,1.366,.364,.179,.31,.511,.501,.867,.501h2.268c.552,0,1-.448,1-1,0-.378-.271-.698-.644-.76l-3.041-.507c-1.342-.223-2.315-1.373-2.315-2.733,0-1.654,1.346-3,3-3v-1c0-.552,.447-1,1-1s1,.448,1,1v1h.268c1.067,0,2.063,.575,2.598,1.5,.277,.478,.113,1.089-.364,1.366-.48,.277-1.091,.113-1.366-.365-.179-.309-.511-.5-.867-.5h-2.268c-.552,0-1,.449-1,1,0,.378,.271,.698,.644,.76l3.041,.507c1.342,.223,2.315,1.373,2.315,2.733Z" />
                                </svg>

                                <Text className="text-muted">$0.0108/day</Text>
                            </div>
                        </div>
                        <Button className="bg-gray-700 font-bold hover:!text-text-hover py-5">Help</Button>
                        <Button className="bg-gray-700 font-bold hover:!text-text-hover py-5">Details</Button>
                    </div>
                </div>
                <div className="px-5 py-8 bg-light-secondary rounded-xl h-fit w-1/3">
                    <Title level={3}>Total daily cost</Title>
                    <div className="flex">
                        <Text className="text-muted flex-1">Rented</Text>
                        <Text strong>1 assets</Text>
                    </div>
                    <div className="flex">
                        <Text className="text-muted flex-1">Total daily fee</Text>
                        <Text strong>$1.0000</Text>
                    </div>

                </div>
            </div>
        </div>
    )
}
