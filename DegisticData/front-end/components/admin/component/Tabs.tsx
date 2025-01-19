import { Tabs, Tab } from "@nextui-org/tabs";
import CreateStationModal from "./createStationModal";
import AddStaffModal from "./addStaffModal";
import StaffList from "./StaffList";
import StationList from "./StationList";

export default function TabsAdmin() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="station" title="Station">
          <StationList />
          <CreateStationModal />
        </Tab>
        <Tab key="staff" title="Staff">
          <StaffList />
          <AddStaffModal />
        </Tab>
      </Tabs>
    </div>
  );
}
