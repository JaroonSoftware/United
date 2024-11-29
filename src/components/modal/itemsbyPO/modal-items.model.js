/** get items column */
import { TagItemTypes } from "../../badge-and-tag";
import { Image } from "antd";
import { BACKEND_URL_MAIN } from '../../../utils/util';
export const columns = ()=>{
  return [
    {
      title: "รหัสใบสั่งซื้อ",
      key: "pocode",
      dataIndex: "pocode", 
    },
    {
      title: "รูปประกอบ",
      dataIndex: "file",
      key: "file",
      width: 120,
      align: "center",
      render: (im, rec) => 
        {
          const img = (!!rec.file_name ? `/uploads/` + rec.file_name : `/logo.png`
          );
          return <>
          <Image
        style={{ borderRadius: 10 }}
        preview={false}
        height={75}
        alt={`Image ${rec.file_name}`}
        src={`${BACKEND_URL_MAIN}` + img}
      />
      </>
      },
    },
    {
      title: "รหัสสินค้า",
      key: "stcode",
      dataIndex: "stcode", 
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "stname",
      key: "stname",
    },
    {
      title: "ราคาต่อหน่วย",
      dataIndex: "price",
      key: "price",
    },    
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
      render: (h)=><TagItemTypes data={h} />,
    },
    {
      title: "จำนวนสั่งซื้อ",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "จำนวนที่รับแล้ว",
      dataIndex: "recamount",
      key: "recamount",
    },
  ]
};