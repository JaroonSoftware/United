import { comma } from "../../utils/util";
export const minstockColumn = ({ handleShowDetail }) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    align: "center",
    width: 60,
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "รหัสสินค้า",
    key: "stcode",
    dataIndex: "stcode",
    align: "left",
    sorter: (a, b) => (a?.stcode || "").localeCompare(b?.stcode || ""),
  },
  {
    title: "ชื่อสินค้า",
    key: "stname",
    dataIndex: "stname",
    align: "left",
    sorter: (a, b) => (a?.stname || "").localeCompare(b?.stname || ""),
  },
  {
    title: "ผู้ขายที่ซื้อ",
    key: "supname",
    dataIndex: "supname",
    align: "left",
    sorter: (a, b) => (a?.supname || "").localeCompare(b?.supname || ""),
  },
  {
    title: "จำนวนในสต๊อก",
    key: "qty",
    dataIndex: "qty",
    align: "left",
    sorter: (a, b) => a.qty - b.qty,
    render: (v) => comma(Number(v))
  },
  {
    title: "จำนวนขั้นต่ำ",
    key: "min",
    dataIndex: "min",
    align: "left",
    sorter: (a, b) => a.min - b.min,
    render: (v) => comma(Number(v))
  },
]
