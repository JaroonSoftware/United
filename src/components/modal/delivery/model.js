import { Typography } from "antd";
import { TagInvoiceStatus } from "../../badge-and-tag";
import dayjs from 'dayjs';

/** get items column */
export const customersColumn = ({handleChoose})=>{
    const Link = Typography.Link;
    return [
      {
        title: "เลขที่ใบแจ้งหนี้",
        key: "dncode",
        width: "15%",
        dataIndex: "dncode", 
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}>{v}</Link>
      },
      {
        title: "วันที่ใบแจ้งหนี้",
        key: "dndate",
        width: "15%",
        dataIndex: "dndate", 
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}>{dayjs(v).format("DD/MM/YYYY")}</Link>
      },
      {
        title: "รหัสลูกค้า",
        key: "cuscode",
        width: "15%",
        dataIndex: "cuscode", 
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}>{v}</Link>
      },
      {
        title: "ชื่อลูกค้า",
        dataIndex: "cusname",
        width: "35%",
        key: "cusname",
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}> {v}</Link>
      },
      {
        title: "สถานะ",
        dataIndex: "doc_status",
        key: "doc_status", 
        width: '20%',
        align: "center",
        sorter: (a, b) => a.doc_status.localeCompare(b.doc_status),
        sortDirections: ["descend", "ascend"],
        render: (data) => <TagInvoiceStatus result={data} />,
      },
    ]
  };