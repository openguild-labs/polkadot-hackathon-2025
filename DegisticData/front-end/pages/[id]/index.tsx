import MainSide from "@/components/user/mainSide";
import RightSide from "@/components/user/rightSide";
import { Sidebar } from "@/components/user/sideBar";
import { categories } from "@/const/common.const";
import DefaultLayout from "@/layouts/default";
import React from "react";

function userDashboard() {
  return (
    <DefaultLayout>
      <div className="flex">
        <Sidebar categories={categories}/>
        <MainSide />
        <RightSide />
      </div>
    </DefaultLayout>
  );
}

export default userDashboard;
