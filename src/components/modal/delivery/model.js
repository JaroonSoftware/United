/** get items column */
import dayjs from 'dayjs';
import { TagDeliveryNoteStatus } from "../../../components/badge-and-tag/";

export const columns = ()=>{
  return [
    {
      key: "code",
      dataIndex: "code",
      align: "left",
      hidden: true,
    },
    {
      title: "รหัสใบส่งสินค้า",
      key: "dncode",
      dataIndex: "dncode", 
    },
    {
      title: "วันที่ใบส่งสินค้า",
      key: "dndate",
      dataIndex: "dndate", 
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
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
      render: (data) => <TagDeliveryNoteStatus result={data} />,
    },
  ]
};