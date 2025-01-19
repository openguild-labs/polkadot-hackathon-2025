import MainSideAdmin from "@/components/admin/mainSide";
import RightSideAdmin from "@/components/admin/rightSide";
import { Sidebar } from "@/components/user/sideBar";
import { categories } from "@/const/common.const";
import DefaultLayout from "@/layouts/default";
import React from "react";

function index() {
  return (
    <DefaultLayout>
      <div className="flex">
        <Sidebar categories={[categories[0]]} />
        <MainSideAdmin />
        <RightSideAdmin />
      </div>
    </DefaultLayout>
  );
}

export default index;
