/** get items column */
import dayjs from 'dayjs';
import { TagReceiptStatus } from "../../../components/badge-and-tag/";

export const columns = ()=>{
  return [
    {
      key: "code",
      dataIndex: "code",
      align: "left",
      hidden: true,
    },
    {
      title: "รหัสใบเสร็จรับเงิน",
      key: "recode",
      dataIndex: "recode", 
    },
    {
      title: "วันที่ใบเสร็จรับเงิน",
      key: "redate",
      dataIndex: "redate", 
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "วันที่ครบกำหนด",
      key: "duedate",
      dataIndex: "duedate", 
      render: (v,rec) => !!rec.duedate ? dayjs(v).format("DD/MM/YYYY") : '',
    },    
    {
      title: "Vat",
      dataIndex: "vat",
      key: "vat",
    },
      {
        title: "ราคารวม",
        dataIndex: "grand_total_price",
        key: "grand_total_price",
      },
    {
      title: "สถานะ",
      dataIndex: "doc_status",
      key: "doc_status", 
      width: '13%',
      render: (data) => <TagReceiptStatus result={data} />,
    },
  ]
};