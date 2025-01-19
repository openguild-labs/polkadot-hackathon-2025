import NotificationIcon from "@/components/common/icons/NotificationIcon";
import { Button, Popover } from "antd";

export default function Notifications() {

    return (
        <Popover
            trigger="click"
            arrow={false}
            placement="bottom"
        >
            <Button className="w-9 h-full">
                <div><NotificationIcon /></div>
            </Button>
        </Popover>
    )
}
