import { CategoryItem } from "@/types"
import { REM } from "next/font/google"

export const DeliveryWriteFunc = {
    CREATEORDER: "createOrder",	
    CREATESTATION: "createStation",
    INITPAYMENT: "initPayment",
    PAY: "pay",
    VALIDATE: "validate",
}

export const DeliveryReadFunc = {
    CHECKDONE: "checkDone",
    GETALLORDER: "getAllOrder",
    GETALLPAYMENTS: "getAllPayments",
    GETALLSTATION: "getAllStation",
    GETDETAILORDER: "getDetailOrder",
    GETDETAILPAYMENT: "getDetailPayment",
    GETDETAILSTATION: "getDetailStation",
    ISVALIDATOR: "isValidator",
    ORDERS: "orders",
    OWNER: "owner",
    STATIONS: "stations",
}


export const PaymentWriteFunc = {
    INITPAYMENT: "initPayment",
    PAY: "pay",
}

export const PaymentReadFunc = {
    CHECKDONE: "checkDone",
    GETALLPAYMENTS: "getAllPayments",
    GETDETAILPAYMENT: "getDetailPayment",
    PAYMENTS: "payments",
}

export const StaffWriteFunc = {
    ADDSTAFF: "addStaff",
    MODIFYSTAFF: "modifyStaff",
    REMOVESTAFF: "removeStaff",
}

export const StaffReadFunc = {
    ISEXISTSTAFF: "isExistStaff",
    GETALLSTAFFSONSTATION: "getAllStaffsOnStation",
}

export const categories: CategoryItem[] = [
    {
        id: 1,
        title: "Dashboard",
        icon: "fa-solid fa-house"
    },
    {
        id: 2,
        title: "Messages",
        icon: "fa-solid fa-message"
    },
    {
        id: 3,
        title: "Routes",
        icon: "fa-solid fa-map"
    },
    {
        id: 4,
        title: "Inbox",
        icon: "fa-solid fa-envelope"
    },
    {
        id: 5,
        title: "Schedule",
        icon: "fa-solid fa-calendar-minus"
    },
    {
        id: 6,
        title: "Payments",
        icon: "fa-solid fa-cart-shopping"
    },   
    {
        id: 7,
        title: "Reports",
        icon: "fa-solid fa-clipboard"
    },   
]