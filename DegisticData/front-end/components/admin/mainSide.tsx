import React from "react";
import TabsAdmin from "./component/Tabs";
import Header from "./component/header";

function MainSideAdmin() {
  return (
    <div className="h-screen w-[50%] p-5">
      <Header />
      <TabsAdmin />
    </div>
  );
}

export default MainSideAdmin;
