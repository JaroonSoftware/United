/** get items column */
import { TagItemTypes,TagsCreateBy,TagSalesOrderStatus } from "../../badge-and-tag";
import { Image,Tooltip } from "antd";
import { BACKEND_URL_MAIN } from '../../../utils/util';
import dayjs from 'dayjs';
// import { TagSalesOrderStatus } from "../../components/badge-and-tag";

export const columns = ()=>{
  return [
    {
    title: "รหัสใบสั่งขายสินค้า",
    key: "socode",
    dataIndex: "socode",
    align: "left",
    sorter: (a, b) => (a.socode).localeCompare(b.socode),
    width:140,
  },
  {
    title: "วันที่ใบสั่งขายสินค้า",
    dataIndex: "sodate",
    key: "sodate",
    width: 140,
    sorter: (a, b) => (a.sodate).localeCompare(b.sodate),
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: "รหัสลูกค้า",
    dataIndex: "cuscode",
    key: "cuscode",
    width: 120,
    sorter: (a, b) => (a.cuscode).localeCompare(b.cuscode),
  },
  {
    title: "ชื่อลูกค้า",
    dataIndex: "cusname",
    key: "cusname", 
    sorter: (a, b) => (a.cusname).localeCompare(b.cusname),
    ellipsis: {
      showTitle: false,
    },
    render: (v) => <Tooltip placement="topLeft" title={v}>{v}</Tooltip>, 
  },
  {
    title: "สถานะ",
    dataIndex: "doc_status",
    key: "doc_status", 
    width: '13%',
    sorter: (a, b) => a.doc_status.localeCompare(b.doc_status),
    sortDirections: ["descend", "ascend"],
    render: (data) => <TagSalesOrderStatus result={data} />,
  },
  { 
    title: "จัดทำโดย",
    dataIndex: "created_name",
    key: "created_name", 
    sorter: (a, b) => (a.created_name).localeCompare(b.created_name),
    width: '15%',
    ellipsis: {
      showTitle: false,
    },
    render: (data,role) => <TagsCreateBy result={data} role={role} />, 
  },
    // {
    //   title: "รูปประกอบ",
    //   dataIndex: "file",
    //   key: "file",
    //   width: 120,
    //   align: "center",
    //   render: (im, rec) => 
    //     {
    //       const img = (!!rec.file_name ? `/uploads/` + rec.file_name : `/logo.png`
    //       );
    //       return <>
    //       <Image
    //     style={{ borderRadius: 10 }}
    //     preview={false}
    //     height={75}
    //     alt={`Image ${rec.file_name}`}
    //     src={`${BACKEND_URL_MAIN}` + img}
    //   />
    //   </>
    //   },
    // },
    // {
    //   title: "ชื่อสินค้า",
    //   dataIndex: "stname",
    //   key: "stname",
    // },
    // {
    //   title: "จำนวนที่ขาย",
    //   dataIndex: "qty",
    //   key: "qty",
    // },
    //   {
    //     title: "จำนวนที่ซื้อแล้ว",
    //     dataIndex: "buyamount",
    //     key: "buyamount",
    //   },
    // {      
    //   title: "หน่วย",
    //   dataIndex: "unit",
    //   key: "unit",
    //   render: (h)=><TagItemTypes data={h} />,
    // },
  ]
};