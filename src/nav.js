import {
  FileTextFilled,
  ReconciliationFilled,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  FaUserCircle,
  FaWarehouse,
  FaTag,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { RiTeamFill, RiBox3Fill } from "react-icons/ri";
import { MdOutlineDashboard } from "react-icons/md";
import { PiCodepenLogoBold } from "react-icons/pi";
import { MdFormatShapes } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { IoLogoModelS } from "react-icons/io";
import { GiDatabase } from "react-icons/gi";
import { TiThLarge } from "react-icons/ti";
import { TfiTruck } from "react-icons/tfi";
import { BsShop } from "react-icons/bs";

let _nav = [
  {
    title: "MENU",
    type: "group",
  },
  {
    title: "หน้าหลัก",
    icon: <MdOutlineDashboard className="nav-ico" />,
    to: "/dashboard",
  },
  {
    title: "SELL",
    type: "group",
  },
  {
    title: "ใบเสนอราคา (QT)",
    icon: <FileTextFilled className="nav-ico" />,
    // to: "/1",
    to: "/quotation",
  },
  {
    title: "ใบขายสินค้า (SO)",
    icon: <ReconciliationFilled className="nav-ico" />,
    to: "/sales-order",
  },
  {
    title: "ใบส่งของ (DN)",
    icon: <TfiTruck className="nav-ico" />,
    to: "/delivery-note",
  },
  {
    title: "ใบเสร็จรับเงิน (RE)",
    icon: <TbReportMoney className="nav-ico" />,
    to: "/receipt",
  },  
  {
    title: "ใบวางบิล (IV)",
    icon: <FaUserCircle className="nav-ico" />,
    to: "/invoice",
  },
  {
    title: "ข้อมูลลูกค้า",
    icon: <RiTeamFill className="nav-ico" />,
    to: "/customers",
  },
  {
    title: "BUY",
    type: "group",
  },
  {
    title: "ใบสั่งซื้อ (PO)",
    icon: <FileTextFilled className="nav-ico" />,
    to: "/purchase-order",
  },
  {
    title: "ใบรับสินค้า (GR)",
    icon: <FileDoneOutlined className="nav-ico" />,
    to: "/goods-receipt",
  },
  {
    title: "ข้อมูลผู้ขาย",
    icon: <BsShop className="nav-ico" />,
    to: "/supplier",
  },
  {
    title: "ปรับสต๊อก Adjust",
    icon: <FaUserCircle className="nav-ico" />,
    to: "/adjust",
  },
  {
    title: "MASTER",
    type: "group",
  },
  {
    title: "ข้อมูลสินค้า",
    icon: <GiDatabase className="nav-ico" />,
    to: "/items",
  },
  {
    title: "ประเภทสินค้า",
    icon: <TiThLarge className="nav-ico" />,
    to: "/itemtype",
  },
  {
    title: "ชนิดสินค้า",
    icon: <PiCodepenLogoBold className="nav-ico" />,
    to: "/kind",
  },
  {
    title: "ที่จัดเก็บสินค้า",
    icon: <FaWarehouse className="nav-ico" />,
    to: "/location",
  },
  {
    title: "เขตขนส่ง",
    icon: <FaMapMarkedAlt className="nav-ico" />,
    to: "/county",
  },
  {
    title: "แบบรถ",
    icon: <MdFormatShapes className="nav-ico" />,
    to: "/carmodel",
  },
  {
    title: "ยี่ห้อ",
    icon: <FaTag className="nav-ico" />,
    to: "/brand",
  },
  {
    title: "รุ่น",
    icon: <IoLogoModelS className="nav-ico" />,
    to: "/model",
  },
  {
    title: "หน่วยสินค้า",
    icon: <RiBox3Fill className="nav-ico" />,
    to: "/unit",
  },
  {
    title: "ผู้ใช้งาน",
    icon: <FaUserCircle className="nav-ico" />,
    to: "/users",
  }
];

export default _nav;
